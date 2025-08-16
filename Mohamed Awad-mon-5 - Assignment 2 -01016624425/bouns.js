/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number}
 */
var findKthPositive = function(arr, k) {
    let miss= 0;    
    let current = 1;    
    let i = 0;          

    while (true) {
        if (i < arr.length && arr[i] === current) {
            i++; 
        } else {
            miss++;
            if (miss === k) {
                return current; 
            }
        }
        current++; 
    }

};