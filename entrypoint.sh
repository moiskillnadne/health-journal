#!/bin/sh
env=$(env | grep RUN_MODE | grep -oe '[^=]*$')

#without parameters
if [[ -z $env ]] 
then
    echo "Start without parameters"
    yarn run build-ormconfig
    yarn run start
    echo $?
    exit $?
fi

#with parameter start
if [[ $env == start ]] 
then
    echo "Start with parameters $env"
    yarn run build-ormconfig
    yarn run start
fi

#with parameter dev
if [[ $env == dev ]] 
then
    echo "Start with parameters $env"
    yarn run build-ormconfig
    yarn run start:$env
fi

#with parameter debug
if [[ $env == debug ]] 
then
    echo "Start with parameters $env"
    yarn run build-ormconfig
    yarn run start:$env
fi

#with parameter prod
if [[ $env == prod ]] 
then
    echo "Start with parameters $env"
    yarn run build-ormconfig
    yarn run build
    yarn run start:$env
fi