package main

import (
	"flag"
	"fmt"
	"net/http"
	"os"
)

var (
	root = flag.String("root", "", "the path containing the files to serve")
	addr = flag.String("addr", ":10443", "the address to listen for requests on")
	cert = flag.String("cert", "", "the path to the tls cert")
	key  = flag.String("key", "", "the path to the tls key")
)

func checkFlag(f *flag.Flag) {
	if f == nil {
		panic("unknown flag")
	}
	if f.Value.String() == "" {
		fmt.Println("Missing required flag:", f.Name)
		flag.Usage()
		os.Exit(2)
	}
}

func main() {
	flag.Parse()
	checkFlag(flag.Lookup("root"))
	checkFlag(flag.Lookup("addr"))
	checkFlag(flag.Lookup("cert"))
	checkFlag(flag.Lookup("key"))

	http.Handle("/", http.FileServer(http.Dir(*root)))
	if err := http.ListenAndServeTLS(*addr, *cert, *key, nil); err != nil {
		panic(err)
	}
}
