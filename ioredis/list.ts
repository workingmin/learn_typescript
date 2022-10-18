#!/usr/bin/env ts-node

import * as fs from 'fs'
import * as yaml from 'js-yaml'
import { argv, exit } from 'process'
import Redis, { RedisOptions } from 'ioredis';

async function main() {
    if(argv.length != 3) {
        console.log("Usage: " + argv[1] + " <yaml_config>")
        exit(1)
    }
    
    let config;
    try {
        const file = fs.readFileSync(argv[2], 'utf8')
        const str = JSON.stringify(yaml.loadAll(file))
        config = JSON.parse(str)
    } catch (e) {
        console.log(e)
        exit(1)
    }
    
    const host = config[0]['host']
    const port = config[0]['port']
    const db = config[0]['db']
    const password = config[0]['password']
    
    const options: RedisOptions = {
        host, port, password, db
    };
    const redis = new Redis(options);
    
    const key = config[0]['key']
    const offset = config[0]['offset'] || 0
    const count = config[0]['count'] || 15
    
    const node = {
        total: 0,
        counted: 0,
        elements: <any>[],
        offset: offset
    };
    
    try {
        node.total = await redis.llen(key)
        node['elements'] = await redis.lrange(key, offset, offset + count)
        node.counted = node['elements'].length
        node.offset = offset + node['elements'].length
    } catch (e) {
        console.log(e)
    }
    
    console.log(node)
}

main()