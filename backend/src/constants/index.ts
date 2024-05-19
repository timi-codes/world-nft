

export const ZORA_CLIENT_URL = 'https://api.zora.co/graphql';

export const GET_CONTRACT_TOKENS = `
  query GetTokens($collectionAddresses: [String!]) {
  tokens(
    where: { collectionAddresses: $collectionAddresses }
    networks: {network: BASE, chain: BASE_SEPOLIA}
  ) {
    nodes {
      token {
        collectionAddress
        name
        tokenId
        tokenUrl
        tokenUrlMimeType
        owner
        collectionName
        image {
          url
        }
        metadata
      }
    }
  }
  }
`;
