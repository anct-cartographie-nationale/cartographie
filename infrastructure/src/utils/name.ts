import { getStack } from '@pulumi/pulumi';
import { config } from '../config';

export const name = (id: string) => {
  return `${config.projectSlug}-${getStack()}-${id}`;
};
