let test = "sessionToken=4rdo3jjxy8gbaw78bpseqcrff";
let cookieMatch = test.match(/(?<=\bsessionToken=)\w+/);
console.log(cookieMatch)

