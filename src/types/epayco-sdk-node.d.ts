declare module "epayco-sdk-node" {
  interface EpaycoConfig {
    apiKey?: string;
    privateKey?: string;
    lang?: string;
    test?: boolean;
  }

  interface TokenResponse {
    status: boolean;
    id: string;
    cardInfo?: Record<string, unknown>;
  }

  interface ChargeResponse {
    status: boolean;
    data?: {
      ref_payco?: string;
      url_payment?: string;
      [key: string]: unknown;
    };
    ref_payco?: string;
    response?: string;
    cod_response?: string;
    [key: string]: unknown;
  }

  interface EpaycoInstance {
    token: {
      create: (card: Record<string, string>) => Promise<TokenResponse>;
    };
    charge: {
      create: (data: Record<string, unknown>) => Promise<ChargeResponse>;
    };
  }

  export default function Epayco(config: EpaycoConfig): EpaycoInstance;
}
