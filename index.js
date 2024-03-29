require('dotenv').config();
const { spawn } = require('child_process');

if (process.argv[2] !== "Main") {
	var restartTimes = 0;
	function startMainProcess() {
		console.log(`[+]GITpipeLOCAL => Start ${++restartTimes} times.`)
		const main = spawn(process.argv[0], [process.argv[1], 'Main'], { stdio: 'inherit' });
		main.on('exit', async function (code) {
			if (code !== 0) {
				console.log('[-]GITpipeLOCAL => Error when start!')
				await new Promise((r) => { setTimeout(r, 3000) })
				startMainProcess();
			} else startMainProcess();
		});
	}

	startMainProcess();
} else {
const path = require("path")
const fs = require("fs")
const simpleGit = require('simple-git');

if(!process.env.localrepoPath || !process.env.remoteUrlWithToken){
	console.log("[-]localrepoPath and remoteUrlWithToken is needed!")
	process.exit()
}
const remoteUrlWithToken = process.env.remoteUrlWithToken;
const remote = process.env.remoteOrigin || 'origin';
const branch = process.env.remoteBranch || 'main';
const repoPath = path.resolve( process.env.localrepoPath); 
//{ config: ['http.proxy=someproxy'] }
const Interval = parseInt(process.env.Interval) || 3000
if((!fs.existsSync(repoPath))) 	fs.mkdirSync(repoPath);
const git = simpleGit(repoPath);
(async ()=>{

try{
	await git.status()
}catch(e){
console.log("[+]Cloning!")
	await git.clone(remoteUrlWithToken,repoPath)
}
await git.addConfig('user.email', 'some@one.com')
await git.addConfig('user.name','someone')
	do{
		
    try {
        // 设置远程仓库URL，包含token
        await git.remote(['set-url', remote, remoteUrlWithToken]);

        // 检查是否有未跟踪的文件
        const status = await git.status();
        if (status.files.length > 0) {
            console.log('[+]Adding untracked files...');
            await git.add("."); // 添加所有未跟踪的文件
            await git.commit('Auto-commit untracked files'); // 提交这些文件
        }

        // 获取本地最新提交的哈希值
        const localLatestHash = await git.revparse(['HEAD']);

        // 获取远程最新提交的哈希值
		await git.fetch()
        const remoteLatestHash = await git.revparse([`${remote}/${branch}`]);



		
        if (localLatestHash !== remoteLatestHash) {
		 console.log(`[+]Local latest hash: ${localLatestHash}`);
        console.log(`[+]Remote latest hash: ${remoteLatestHash}`);
            if (status.ahead > 0) {
                console.log('[+]Local is ahead of remote, pushing changes...');
                await git.push(remote, branch);
            } else if (status.behind > 0) {
                console.log('[+]Remote is ahead of local, pulling changes...');
                await git.pull(remote, branch);
            }
        } else {
            console.log('[+]Local and remote are in sync.');
        }
		
    } catch (error) {
        console.error('[-]Error during sync check:', error);
    }
	await new Promise(r=>{setTimeout(r,Interval)})
	}while(true);
})()
}
