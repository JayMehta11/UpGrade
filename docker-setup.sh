#! /usr/bin/env nix-shell
#! nix-shell -i bash --pure -p bash nodejs-12_x cacert
#! nix-shell -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/e74894146a42ba552ebafa19ab2d1df7ccbc1738.tar.gz

# above channel commit hash is nixos-21.05 ~ 2021-11-09

#to execute this script, you only need to install nix-shell:
#sh <(curl -L https://nixos.org/nix/install)
#(see https://nixos.org/nix/ for more)

set -e;
set -u;

localsetup() {
    rm -rf package-lock.json node_modules
    npm install

    cd types
    rm -rf package-lock.json node_modules
    npm install

    cd ../backend
    rm -rf package-lock.json node_modules
    npm install

    cp -R ../types packages/Upgrade
    cd packages/Upgrade
    rm -rf package-lock.json node_modules
    npm install

    cd ../../../frontend
    rm -rf package-lock.json node_modules
    npm install
}

mirrorsetup() {
    cd backend
    npm ci

    cp -R ../types packages/Upgrade
    cd packages/Upgrade
    cp .env.docker.local .env
    npm ci

    cd ../../../frontend
    npm ci
}

help() {
    cat <<EOF
Usage:
    -h: this help guide
    -l: run setup for local development environment
    -m: run setup for mirroring qa/prod environment
EOF
    exit 0;
}

while getopts hlm opt
do
    case "$opt" in
        h) help;;
	    l) localsetup;;
        m) mirrorsetup;;
    esac
done