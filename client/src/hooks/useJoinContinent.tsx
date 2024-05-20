import 

const useJoinContinent = () => { 
    const join = async (continent: string) => { 
        fetchAPI(`/citizenship/${continent.tokenId}`, "POST", { tokenId: continent.tokenId })
    }

    return {
        join
    }
}

export default useJoinContinent;