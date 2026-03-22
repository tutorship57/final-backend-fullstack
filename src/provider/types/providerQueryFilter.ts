import { ProviderType } from '../entities/provider.entity';
export interface ProviderFindOneQuery {
  id?: string;
  provider?: ProviderType;
  sub_id?: string;
  userId?: string;
}
