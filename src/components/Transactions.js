import {useState, useEffect} from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getTransactions = async () => {
      try {
        const response = await axiosPrivate.get("/transactions", {
          signal: controller.signal
        })
        console.log(response.data);
        isMounted && setTransactions(response.data)

      } catch (err) {
        console.log(err)
      }
    }

    getTransactions();

    return () => {
      isMounted = false;
      controller.abort();
    }


  },[])
  
  
  return (
    <article>
      <h2>Transactions</h2>
      {transactions?.length
      ? (
        <ul>
          {transactions.map((transaction, i) => 
            (<li key={i}>{transaction?.name}</li>)
          )}
        </ul>
      ): <p>No transactinos to display</p>
     }
    </article>
  )
}

export default Transactions