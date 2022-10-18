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
    const min = config[0]['min'] ? config[0]['min'] : '-inf'
    const max = config[0]['max'] ? config[0]['max'] : '+inf'
    const offset = config[0]['offset'] || 0
    const count = config[0]['count'] || 15
    
    const node = {
        total: 0,
        counted: 0,
        members: <any>[],
        offset: offset
    };
    
    let result
    try {
        node.total = await redis.zcount(key, min, max)
        result = await redis.zrangebyscore(key, min , max, 'WITHSCORES', 'LIMIT', offset, count)
        node.counted = result.length
        node.offset = offset + result.length

        let members = new Array()
        for(let i = 0; i < result.length; i = i+2 ) {
            let member = {}
            member['name'] = result[i]
            member['score'] = result[i+1]
            members.push(member)
        }
        node.members = members
    } catch (e) {
        console.log(e)
    }
    
    console.log(node)
}

main()