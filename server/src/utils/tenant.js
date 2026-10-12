export function tenantFilter(req, extra={}){
  if(req.user.role==='super_admin') return extra;
  return {...extra,tenantId:req.user.tenantId};
}
