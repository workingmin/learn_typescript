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
    
    const match = config[0]['match'] !== undefined ? config[0]['match'] : '*'
    const count = config[0]['count'] || 15
    const cursor = config[0]['cursor'] || 0
    
    const node = {
        total: 0,
        scanned: 0,
        keys: <any>[],
        cursor: cursor
    };
    
    let result
    try {
        node.total = await redis.dbsize()
        
        result = await redis.scan(cursor, "MATCH", match, "COUNT", count)
        node.cursor = result[0]
        node.scanned = result[1].length
        
        let keys = new Array()
        for(let i in result[1]) {
            let v = result[1][i]
            let key = {}
            key['name'] = v
            key['type'] = await redis.type(v)
            key['ttl'] = await redis.ttl(v)
            key['size'] = await redis.memory("USAGE", v)
        
            if(key['type'] == 'string') {
                key['length'] = await redis.strlen(v)
            }
            else if(key['type'] == 'hash') {
                key['length'] = await redis.hlen(v)
            }
            else if(key['type'] == 'list') {
                key['length'] = await redis.llen(v)
            }
            else if(key['type'] == 'set') {
                key['length'] = await redis.scard(v)
            }
            else if(key['type'] == 'zset') {
                key['length'] = await redis.zcard(v)
            }

            keys.push(key)
        }
        node.keys = keys
    } catch (e) {
        console.log(e)
    }

    console.log(node)
}

main()