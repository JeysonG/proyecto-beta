let gulp = require('gulp');  
let childProcess = require('child_process');  
//var exec = childProcess.exec;  
let spawn = childProcess.spawn;

let server;

function createServer() {  
  return spawn('node', ['./app/index.js'], {stdio: "inherit", cwd: process.cwd() });
}

gulp.task('server', () => {  
  server = createServer();
});

gulp.task('default', ['server'], () => {  
  gulp.watch('app/**/*.js', () => {
    if (server) { server.kill(); }
    server = createServer();
  });

  gulp.watch('app/**/*.html', () => {
    if (server) { server.kill(); }
    server = createServer();
  });
});