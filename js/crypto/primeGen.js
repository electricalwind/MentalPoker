
var randomChoose = function(array){
    // Select a random card in cardsList
    var index = Math.floor(Math.random() * array.length)
    var element = array[index];

    return element;
};

var findPrimes = function(n) {
    var i,s,p,ans;
    s=new Array(n);
    for (i=0;i<n;i++)
        s[i]=0;
    s[0]=2;
    p=0;    //first p elements of s are primes, the rest are a sieve
    for(;s[p]<n;) {                  //s[p] is the pth prime
        for(i=s[p]*s[p]; i<n; i+=s[p]) //mark multiples of s[p]
            s[i]=1;
        p++;
        s[p]=s[p-1]+1;
        for(; s[p]<n && s[s[p]]; s[p]++); //find next prime (where s[p]==0)
    }
    ans=new Array(p);
    for(i=0;i<p;i++)
        ans[i]=s[i];
    return ans;
};
var computePrimeNumber = function(maximum){
    var numbers = findPrimes(maximum);
    var prime = 0;
    while (prime <= 100)
        prime = randomChoose(numbers);
    return prime;
};


