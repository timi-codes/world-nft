import { useQuery } from '@tanstack/react-query';

const fetchAuctions = async () => { 
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auctions`)
    const data = await response.json()
    return data
}


const useFetchContinents = () => {
    const  { data, ...rest} = useQuery({ queryKey: ['continents'], queryFn: fetchAuctions })
    return { data: data?.data, ...rest }
};

export default useFetchContinents;