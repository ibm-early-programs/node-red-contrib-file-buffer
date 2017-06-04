# node-red-contrib-file-buffer

[Node-RED](http://nodered.org) Node to be used in conjunction with the
http multipart in node.
As the multipart node does not provide a buffer, this node can be used to load a
file using a path into a buffer or as a stream.


## Install

Run the following command in the root directory of your Node-RED install:

````
    npm install node-red-contrib-file-buffer
````

## Usage

### Input
Set msg.payload to a file path. If you are using the http in multipart node then the path for the first file will be

````
    var files = Object.keys(msg.req.files);

    msg.payload = msg.req.files[files[0]][0].path;
````


### Output
msg.payload will be a buffer or a stream containing the file contents.

### Sample flow
This flow uses a multipart form to send a file to Watson Recognition for
classification.

````
[{"id":"eb836b23.3e0a68","type":"http response","z":"a0fe910.b40c17","name":"","x":615,"y":119,"wires":[]},{"id":"bb218734.439a58","type":"httpInMultipart","z":"a0fe910.b40c17","name":"Classify Image","url":"/classify","method":"post","fields":"[{ \"name\":\"pic\"}]","swaggerDoc":"","x":86,"y":177,"wires":[["d75e6046.76f49"]]},{"id":"11b6c481.a08d3b","type":"http in","z":"a0fe910.b40c17","name":"Get Home Page","url":"/homepage","method":"get","swaggerDoc":"","x":85,"y":107,"wires":[["31531035.4de9d"]]},{"id":"31531035.4de9d","type":"template","z":"a0fe910.b40c17","name":"Form and Response Template","field":"payload","fieldType":"msg","format":"handlebars","syntax":"mustache","template":" <html>\n     <body>\n        <form action=\"/classify\" method=\"post\" enctype=\"multipart/form-data\">\n            <input type=\"file\" name=\"pic\" accept=\"image/*\"><br>\n            <input type=\"submit\" value=\"Submit\">\n        </form> \n        <div>Classifications:</div>\n        <div>\n            {{#result}}\n            <table>\n            <tr>\n                <th>Class</th>\n                <th>Score</th>\n                <th>Type</th>\n            </tr>\n            {{#images}}\n            {{#.}}\n            {{#classifiers}}\n            {{#.}}\n            {{#classes}}\n            {{#.}}\n                <tr>\n                    <td>{{class}}</td>\n                    <td>{{score}}</td> \n                    <td>{{&type_hierarchy}}</td>\n                </tr>                \n            {{/.}} \n            {{/classes}}            \n            {{/.}}            \n            {{/classifiers}}\n            {{/.}}\n            {{/images}}\n            </table>\n            {{/result}}\n        </div>\n     </body>\n</html>","x":364.5,"y":117,"wires":[["eb836b23.3e0a68"]]},{"id":"d75e6046.76f49","type":"function","z":"a0fe910.b40c17","name":" Determine File Path","func":"if (msg.req.files) {\n    var files = Object.keys(msg.req.files);\n    msg.payload = msg.req.files[files[0]][0].path;    \n}\nreturn msg;","outputs":1,"noerr":0,"x":109.5,"y":234,"wires":[["bea9b8a5.b99eb8"]]},{"id":"50dca2d0.e3764c","type":"visual-recognition-v3","z":"a0fe910.b40c17","name":"","apikey":"","image-feature":"classifyImage","lang":"en","x":345,"y":233,"wires":[["969cd9bb.6d62f8","31531035.4de9d"]]},{"id":"969cd9bb.6d62f8","type":"debug","z":"a0fe910.b40c17","name":"","active":true,"console":"false","complete":"result","x":556.5,"y":277,"wires":[]},{"id":"bea9b8a5.b99eb8","type":"file-buffer","z":"a0fe910.b40c17","name":"","x":144,"y":307,"wires":[["50dca2d0.e3764c"]]}]
````

## Contributing
For simple typos and fixes please just raise an issue pointing out our mistakes. If you need to raise a pull request please read our [contribution guidelines](https://github.com/ibm-early-programs/node-red-contrib-file-buffer/blob/master/CONTRIBUTING.md) before doing so.

## Copyright and license

Copyright 2017 IBM Corp. under the Apache 2.0 license.
