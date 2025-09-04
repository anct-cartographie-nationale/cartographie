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
import { scalewayProvider } from './scaleway.provider';

export const vpc = new network.Vpc(
  `${config.projectSlug}-vpc`,
  { name: `${config.projectSlug}-vpc`, tags: config.tags },
  { provider: scalewayProvider }
);

const privateNetwork = new network.PrivateNetwork(
  `${config.projectSlug}-private-network`,
  {
    name: `${config.projectSlug}-private-network`,
    tags: config.tags,
    ipv4Subnet: { subnet: '172.16.64.0/22' },
    vpcId: vpc.id,
    region: 'fr-par'
  },
  { provider: scalewayProvider }
);

const ipV4 = new loadbalancers.Ip('v4', { zone: 'fr-par-1', tags: config.tags }, { provider: scalewayProvider });

const ipV6 = new loadbalancers.Ip('v6', { isIpv6: true, zone: 'fr-par-1', tags: config.tags }, { provider: scalewayProvider });

export const appLoadBalancer = new loadbalancers.LoadBalancer(
  `${config.projectSlug}-app-lb`,
  {
    name: `${config.projectSlug}-app-lb`,
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
  `${config.projectSlug}-app-lb-backend`,
  {
    name: `${config.projectSlug}-app-lb-backend`,
    lbId: appLoadBalancer.id,
    forwardProtocol: 'http',
    forwardPort: 3000
  },
  { provider: scalewayProvider }
);

const frontend = new loadbalancers.Frontend(
  `${config.projectSlug}-app-lb-frontend`,
  {
    name: `${config.projectSlug}-app-lb-frontend`,
    lbId: appLoadBalancer.id,
    backendId: backend.id,
    inboundPort: 80,
    enableHttp3: true
  },
  { provider: scalewayProvider }
);

const edgeServicesPlan = new EdgeServicesPlan(
  `${config.projectSlug}-edge-services-plan`,
  { name: 'starter' },
  { provider: scalewayProvider }
);

const pipeline = new EdgeServicesPipeline(
  `${config.projectSlug}-edge-services-pipeline`,
  { name: `${config.projectSlug}-edge-services-pipeline`, description: `${config.projectName} edge services pipline` },
  { provider: scalewayProvider, dependsOn: [edgeServicesPlan] }
);

const backendStage = new EdgeServicesBackendStage(
  `${config.projectSlug}-edge-services-backend`,
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
  `${config.projectSlug}-edge-services-waf`,
  {
    pipelineId: pipeline.id,
    backendStageId: backendStage.id,
    mode: 'enable',
    paranoiaLevel: 3
  },
  { provider: scalewayProvider }
);

const routeStage = new EdgeServicesRouteStage(
  `${config.projectSlug}-edge-services-route`,
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
  `${config.projectSlug}-edge-services-cache`,
  {
    pipelineId: pipeline.id,
    routeStageId: routeStage.id
  },
  { provider: scalewayProvider }
);

const tlsStage = new EdgeServicesTlsStage(
  `${config.projectSlug}-edge-services-tls`,
  {
    pipelineId: pipeline.id,
    cacheStageId: cacheStage.id,
    managedCertificate: true
  },
  { provider: scalewayProvider }
);

const dnsStage = new EdgeServicesDnsStage(
  `${config.projectSlug}-edge-services-dns`,
  {
    pipelineId: pipeline.id,
    tlsStageId: tlsStage.id
  },
  { provider: scalewayProvider }
);

new EdgeServicesHeadStage(
  `${config.projectSlug}-edge-services-head`,
  {
    pipelineId: pipeline.id,
    headStageId: dnsStage.id
  },
  { provider: scalewayProvider }
);

export const APP_PRIVATE_NETWORK_ID = privateNetwork.id;
