const sortOnTime = (firTrans, secondTrans) =>{
    return (new Date(firTrans.time)) - (new Date(secondTrans.time));
}

const isDuplicateTrans = (trans1, trans2) => {
    return ((trans1.sourceAccount === trans2.sourceAccount)
    && (trans1.targetAccount === trans2.targetAccount)
    && (trans1.category === trans2.category)
    && (trans1.amount === trans2.amount)
    && (Math.abs((new Date(trans1.time) - new Date(trans2.time)) / 60000) < 1));

}

function findDuplicateTransactions(transactions = []) {
	// code here
    if (transactions.length < 2){
        return []
    }else{
        let dulpicates = []
        transactions.sort(sortOnTime)
        transactions.forEach(transaction => {
            let foundDuplicated= false;
            for (let duplicateBatch of dulpicates) {
                if (isDuplicateTrans(transaction, duplicateBatch[duplicateBatch.length - 1])) {
                    duplicateBatch.push(transaction);
                    foundDuplicated = true;
                    break;
                }
            }
            if (!foundDuplicated) dulpicates.push([transaction]);
        })
        return dulpicates.filter(duplicateBatch => duplicateBatch.length > 1);
    }
} 

const tr = [
    {
      "id": 3,
      "sourceAccount": "A",
      "targetAccount": "B",
      "amount": 100,
      "category": "eating_out",
      "time": "2018-03-02T10:34:30.000Z"
    },
    {
      "id": 1,
      "sourceAccount": "A",
      "targetAccount": "B",
      "amount": 100,
      "category": "eating_out",
      "time": "2018-03-02T10:33:00.000Z"
    },
    {
      "id": 6,
      "sourceAccount": "A",
      "targetAccount": "C",
      "amount": 250,
      "category": "other",
      "time": "2018-03-02T10:33:05.000Z"
    },
    {
      "id": 4,
      "sourceAccount": "A",
      "targetAccount": "B",
      "amount": 100,
      "category": "eating_out",
      "time": "2018-03-02T10:36:00.000Z"
    },
    {
      "id": 2,
      "sourceAccount": "A",
      "targetAccount": "B",
      "amount": 100,
      "category": "eating_out",
      "time": "2018-03-02T10:33:50.000Z"
    },
    {
      "id": 5,
      "sourceAccount": "A",
      "targetAccount": "C",
      "amount": 250,
      "category": "other",
      "time": "2018-03-02T10:33:00.000Z"
    }
  ]
console.log(findDuplicateTransactions(tr))

