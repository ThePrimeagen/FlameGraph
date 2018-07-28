#!/usr/bin/env node
/**
 * stackcolllapse-nrdp.js  collapse nrdp hierarchical json output into single
 * lines.
 *
 * USAGE: ./stackcollapse-nrdp.js infile > outfile
 *
 * Example Input:
 * {
 *     "startTime": 0.000000,
 *     "endTime": 1.254009,
 *     "self": 0.000000,
 *     "head": {
 *         "functionName": "Thread_1",
 *         "hitCount": 0.0000001,
 *         children: [{
 *             "functionName": "(program)",
 *             "hitCount": 0.0000017,
 *             ...
 *         }]
 *         ...
 *     }
 * }
 *
 * Example Output:
 *
 * Thread_1 1
 * Thread_1;(program) 17
 *
 * Copyright 2018 Netflix (https://twitter.com/NetflixUIE).  All rights
 * reserved.
 *
 *  This program is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU General Public License
 *  as published by the Free Software Foundation; either version 2
 *  of the License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software Foundation,
 *  Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 *
 *  (http://www.gnu.org/copyleft/gpl.html)
 *
 * 28-July-2018  Michael Paulson  Created this.
 */

const fs = require('fs');
const fileContents = fs.readFileSync(process.argv[2], 'utf-8').toString()
const stdout = process.stdout;
const parsedData = JSON.parse(fileContents);

// Walk the tree and create the comma delimited lists of stacks.
// I will use 1000000 * selfTime as the number of ticks for that stack.
// time is in microseconds
const head = parsedData.head;
const path = [];
walk(head, path);


function walk(node, path) {
    path.push(node.functionName);
    write([
        path.join(';'),
        node.hitCount * 1e6
    ].join(' '));
    node.children.forEach(c => walk(c, path));
    path.pop();
}

function write(str) {
    stdout.write(str);
    stdout.write('\n');
}
