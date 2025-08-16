//Write your MySQL query statement below
query =`
select visits.customer_id , COUNT(*) AS count_no_trans
from visits LEFT JOIN Transactions ON visits.visit_id=Transactions.visit_id
WHERE  Transactions.visit_id IS NULL
GROUP BY 
    visits.customer_id`;