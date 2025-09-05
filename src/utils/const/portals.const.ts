export interface PortalInfo {
  id: string;
  portal_db_id: number;
  name: string;
  image: string;
}

export interface PortalImportarInfo {
  id: number;
  name: string;
  disabled: boolean;
}

export const AVAILABLE_PORTALS: PortalInfo[] = [
  { id: "IMOVEL_WEB", portal_db_id: 1, name: "Imóvel Web", image: "/images/portais/imovel-web.png" },
  { id: "CANAL_PRO", portal_db_id: 2, name: "Canal Pro", image: "/images/portais/canal-pro.png" },
  { id: "LITORAL", portal_db_id: 6, name: "SP Imóvel", image: "/images/portais/sp-imovel.png" },
  { id: "123I", portal_db_id: 7, name: "123i", image: "/images/portais/123-i.png" },
  { id: "CHAVES_NA_MAO", portal_db_id: 9, name: "Chaves na Mão", image: "/images/portais/chaves-na-mao.png" },
  { id: "CASA_MINEIRA", portal_db_id: 10, name: "CasaMineira", image: "/images/portais/casa-mineira.png" },
  { id: "CRECI", portal_db_id: 13, name: "CreciSP", image: "/images/portais/creci-sp.png" },
  { id: "HOMER", portal_db_id: 14, name: "Homer", image: "/images/portais/homer.png" },
  { id: "DREAM_CASA", portal_db_id: 15, name: "Dream Casa", image: "/images/portais/dream-casa.png" },
  { id: "IMOVEL_GUIDE", portal_db_id: 16, name: "Imóvel Guide", image: "/images/portais/imovel-guide.png" },
  { id: "BUSKAZA", portal_db_id: 17, name: "Buskaza", image: "/images/portais/buskaza.png" },
  { id: "PMGF", portal_db_id: 18, name: "MGF Imóveis", image: "/images/portais/mgf-imoveis.png" },
  { id: "COMPRE_ALUGUE", portal_db_id: 20, name: "Compre&Alugue", image: "/images/portais/compre-e-alugue.png" },
];

export const AVAILABLE_PORTALS_IMPORTAR: PortalImportarInfo[] = [
  { id: 1, name: "EPUNGO", disabled: true},
  { id: 2, name: "IMOVEL WEB", disabled: true},
  { id: 3, name: "INGAIA", disabled: true},
  { id: 4, name: "UNION", disabled: true},
  { id: 5, name: "CASA MINEIRA", disabled: true},
  { id: 6, name: "ZAP ANTIGO", disabled: true},
  { id: 7, name: "CANAL PRO", disabled: false},
];