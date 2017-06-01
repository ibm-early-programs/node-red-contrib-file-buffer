/**
 * Copyright 2017 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
  var fs = require('fs');


  function verifyPayload(msg) {
    if (!msg.payload) {
      return Promise.reject('Missing property: msg.payload');
    } else {
      return Promise.resolve();
    }
  }

  function loadFile(msg) {
    var p = new Promise(function resolver(resolve, reject) {
        var readStream = fs.readFileSync(msg.payload);
        msg.payload = readStream;
        resolve();
    });
    return p;
  }

  function Node(config) {
    var node = this;
    RED.nodes.createNode(this, config);

    this.on('input', function(msg) {
      //var message = '';
      node.status({
        fill: 'blue',
        shape: 'dot',
        text: 'loading file'
      });

      verifyPayload(msg)
        .then(function() {
          return loadFile(msg);
        })
        .then(function() {
          node.status({});
          node.send(msg);
        })
        .catch(function(err) {
          var messageTxt = err;
          if (err.error) {
            messageTxt = err.error;
          } else if (err.description) {
            messageTxt = err.description;
          }
          node.status({
            fill: 'red',
            shape: 'dot',
            text: messageTxt
          });

          msg.result = {};
          msg.result['error'] = err;
          node.error(messageTxt, msg);
          // Note: This node.send forwards the error to the next node,
          // if this isn't desired then this line needs to be removed.
          // Should be ok as the node.error would already have recorded
          // the error in the debug console.
          node.send(msg);
        });

    });
  }

  RED.nodes.registerType('file-buffer', Node, {
    credentials: {
      token: {
        type: 'text'
      }
    }
  });
};
