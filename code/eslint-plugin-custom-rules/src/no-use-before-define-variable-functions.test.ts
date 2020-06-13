/* eslint-disable func-names */

// Typescript without eslint rules works perfectly for this, this rule is not needed

const cantUseNum = num * 42;
const num = 42;

const cantUseFun = fun() * 42;
const canUseFunWithFun = () => fun() * 42;
const fun = () => 42;

const cantUseFunOldSchool = funOldSchool() * 42;
const canUseFunWithFunOldSchool = function () { return funOldSchool() * 42; };
const funOldSchool = function () { return 42; };

export {
    num,
    cantUseNum,

    fun,
    cantUseFun,
    canUseFunWithFun,
    funOldSchool,
    cantUseFunOldSchool,
    canUseFunWithFunOldSchool,
};
