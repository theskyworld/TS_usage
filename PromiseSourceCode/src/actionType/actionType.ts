type ResolveType = (value: any) => any;
type RejectType = (reason: any) => any;
type Executor = (resovle: RejectType, reject: RejectType) => any;


export {
    ResolveType, 
    RejectType,
    Executor,
}