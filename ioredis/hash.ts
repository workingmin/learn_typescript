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
    const match = config[0]['match'] !== undefined ? config[0]['match'] : '*'
    const count = config[0]['count'] || 15
    const cursor = config[0]['cursor'] || 0
    
    const node = {
        total: 0,
        scanned: 0,
        fields: <any>[],
        cursor: cursor
    };
    
    let result
    try {
        node.total = await redis.hlen(key)
        result = await redis.hscan(key, cursor, "MATCH", match, "COUNT", count)
        node.cursor = result[0]
        node.scanned = result[1].length / 2

        let fields = new Array()
        for(let i = 0; i < result[1].length; i = i+2 ) {
            let field = {}
            field['name'] = result[1][i]
            field['value'] = result[1][i+1]

            fields.push(field)
        }
        node.fields = fields
    } catch (e) {
        console.log(e)
    }
    
    console.log(node)
}

main()