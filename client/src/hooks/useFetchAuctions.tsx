import { Continent } from '@/app/page';
import { FetchAPIResponse, fetchAPI } from '@/utils';
import { useQuery } from '@tanstack/react-query';

export type ContinentsResponse = FetchAPIResponse<Continent[]>;


const fetchContinents = (): Promise<ContinentsResponse> => {
    return fetchAPI<Continent[]>('/auctions');
};

const useFetchContinents = () => {
    return useQuery<ContinentsResponse, Error>({
        queryKey: ['continents'],
        queryFn: fetchContinents
    });
};

export default useFetchContinents;