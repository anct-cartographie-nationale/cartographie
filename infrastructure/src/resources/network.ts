import {
  EdgeServicesBackendStage,
  EdgeServicesCacheStage,
  EdgeServicesDnsStage,
  EdgeServicesHeadStage,
  EdgeServicesPipeline,
  EdgeServicesPlan,
  EdgeServicesRouteStage,
  EdgeServicesTlsStage,
  EdgeServicesWafStage,
  loadbalancers,
  network
} from '@pulumiverse/scaleway';
import { config } from '../config';
import { name } from '../utils/name';
import { scalewayProvider } from './scaleway.provider';

export const vpc = new network.Vpc(
  name('app-vpc'),
  { name: name('app-vpc'), tags: config.tags },
  { provider: scalewayProvider }
);

const privateNetwork = new network.PrivateNetwork(
  name('app-private-network'),
  {
    name: name('app-private-network'),

    tags: config.tags,
    ipv4Subnet: { subnet: '172.16.64.0/22' },
    vpcId: vpc.id,
    region: 'fr-par'
  },
  { provider: scalewayProvider }
);

const ipV4 = new loadbalancers.Ip(
  name('app-lb-ip-v4'),
  { zone: 'fr-par-1', tags: config.tags },
  { provider: scalewayProvider }
);

const ipV6 = new loadbalancers.Ip(
  name('app-lb-ip-v6'),
  { isIpv6: true, zone: 'fr-par-1', tags: config.tags },
  { provider: scalewayProvider }
);

export const appLoadBalancer = new loadbalancers.LoadBalancer(
  name('app-lb'),
  {
    name: name('app-lb'),
    description: `${config.projectName} internal load balancer`,
    tags: config.tags,
    type: 'LB-S',
    privateNetworks: [{ privateNetworkId: privateNetwork.id }],
    ipIds: [ipV4.id, ipV6.id],
    zone: 'fr-par-1',
    sslCompatibilityLevel: 'ssl_compatibility_level_modern'
  },
  { provider: scalewayProvider }
);

const backend = new loadbalancers.Backend(
  name('app-lb-backend'),
  {
    name: name('app-lb-backend'),
    lbId: appLoadBalancer.id,
    forwardProtocol: 'http',
    forwardPort: 3000
  },
  { provider: scalewayProvider }
);

const frontend = new loadbalancers.Frontend(
  name('app-lb-frontend'),
  {
    name: name('app-lb-frontend'),
    lbId: appLoadBalancer.id,
    backendId: backend.id,
    inboundPort: 80,
    enableHttp3: true
  },
  { provider: scalewayProvider }
);

const edgeServicesPlan = new EdgeServicesPlan(name('edge-services-plan'), { name: 'starter' }, { provider: scalewayProvider });

const pipeline = new EdgeServicesPipeline(
  name('edge-services-pipeline'),
  { name: name('edge-services-backend-pipeline'), description: `${config.projectName} edge services pipeline` },
  { provider: scalewayProvider, dependsOn: [edgeServicesPlan] }
);

const backendStage = new EdgeServicesBackendStage(
  name('edge-services-backend-stage'),
  {
    pipelineId: pipeline.id,
    lbBackendConfigs: [
      {
        lbConfig: {
          id: appLoadBalancer.id,
          frontendId: frontend.id,
          zone: 'fr-par-1'
        }
      }
    ]
  },
  { provider: scalewayProvider }
);

const wafStage = new EdgeServicesWafStage(
  name('edge-services-waf-stage'),
  {
    pipelineId: pipeline.id,
    backendStageId: backendStage.id,
    mode: 'enable',
    paranoiaLevel: 3
  },
  { provider: scalewayProvider }
);

const routeStage = new EdgeServicesRouteStage(
  name('edge-services-route-stage'),
  {
    pipelineId: pipeline.id,
    wafStageId: wafStage.id,
    rules: [
      {
        backendStageId: backendStage.id,
        ruleHttpMatch: {
          methodFilters: ['get'],
          pathFilter: {
            pathFilterType: 'regex',
            value: '.*'
          }
        }
      }
    ]
  },
  { provider: scalewayProvider }
);

const cacheStage = new EdgeServicesCacheStage(
  name('edge-services-cache-stage'),
  {
    pipelineId: pipeline.id,
    routeStageId: routeStage.id
  },
  { provider: scalewayProvider }
);

const tlsStage = new EdgeServicesTlsStage(
  name('edge-services-tls-stage'),
  {
    pipelineId: pipeline.id,
    cacheStageId: cacheStage.id,
    managedCertificate: true
  },
  { provider: scalewayProvider }
);

const dnsStage = new EdgeServicesDnsStage(
  name('edge-services-dns-stage'),
  {
    pipelineId: pipeline.id,
    tlsStageId: tlsStage.id
  },
  { provider: scalewayProvider }
);

new EdgeServicesHeadStage(
  name('edge-services-head-stage'),
  {
    pipelineId: pipeline.id,
    headStageId: dnsStage.id
  },
  { provider: scalewayProvider }
);

export const APP_PRIVATE_NETWORK_ID = privateNetwork.id;
