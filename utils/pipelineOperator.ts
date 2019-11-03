// pipe関数を自作した。

const pipe = (input: any, ...methods: any) => methods.reduce((ac: any, cv: any) => cv(ac), input);
export default pipe;