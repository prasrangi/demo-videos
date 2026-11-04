import path from 'node:path';
import {realpath,stat,mkdir,writeFile,rename} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const repository=await realpath(fileURLToPath(new URL('../../',import.meta.url)));
export async function assertPrivateStorage(input){
 if(!input)throw new Error('Specify a private storage directory outside Git and cloud-sync folders.');
 const resolved=await realpath(path.resolve(input));
 const relative=path.relative(repository,resolved);
 if(relative===''||(!relative.startsWith(`..${path.sep}`)&&relative!=='..'&&!path.isAbsolute(relative)))throw new Error('Private storage cannot be inside the public repository.');
 if(/(^|[\\/])(OneDrive[^\\/]*|Dropbox|Google Drive)([\\/]|$)/i.test(resolved))throw new Error('Use local private storage outside cloud-sync folders.');
 let current=resolved;
 while(true){
  try{await stat(path.join(current,'.git'));throw new Error('Private storage cannot be inside any Git checkout.');}catch(error){if(error.code!=='ENOENT')throw error;}
  const parent=path.dirname(current);if(parent===current)break;current=parent;
 }
 return resolved;
}
export async function preparePrivateStorage(input){
 if(!input)throw new Error('Private storage is required.');
 // Check the nearest existing ancestor before creating any directories.
 let ancestor=path.resolve(input);
 while(true){try{await stat(ancestor);break;}catch(error){if(error.code!=='ENOENT')throw error;ancestor=path.dirname(ancestor);}}
 await assertPrivateStorage(ancestor);
 await mkdir(input,{recursive:true,mode:0o700});
 const resolved=await assertPrivateStorage(input);
 if(process.platform==='win32'){
  const identity=execFileSync('whoami',['/user','/fo','csv','/nh'],{encoding:'utf8',windowsHide:true});
  const sid=identity.match(/S-\d+(?:-\d+)+/g)?.at(-1);
  if(!sid)throw new Error('Could not identify the current Windows user for private storage permissions.');
  execFileSync('icacls',[resolved,'/inheritance:r','/grant:r',`*${sid}:(OI)(CI)F`,'*S-1-5-18:(OI)(CI)F'],{stdio:'pipe',windowsHide:true});
 }
 return resolved;
}
export async function atomicJSON(filename,value){
 const temporary=`${filename}.${process.pid}.tmp`;
 await writeFile(temporary,JSON.stringify(value,null,2)+'\n',{mode:0o600,flag:'wx'});
 await rename(temporary,filename);
}
