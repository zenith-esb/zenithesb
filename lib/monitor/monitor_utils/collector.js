var events = require('events')
    ,sys = require('util')
    ,utils = require('./utils')
    ,url=require('url');

//****** Constants ******
var HOST_LISTEN = "127.0.0.1";
var PORT_LISTEN = 10010;
var MAX_VALUE = Number.MAX_VALUE;
var TOP_VIEW = 3; // The maximum number of viewable requests that spent most time for execution
var TOP_LIMIT = 100; // The maximum number of collected requests that spent most time for execution
var TOP_TIMELIMIT = 1; // the monitor have to collect info when exceeding the number of specified seconds only
var TOP_SORTBY = 'max_time'; // the collected paths sorting key
var STATUS_OK = 'OK';
var STATUS_NOK = 'NOK';
var STATUS_DOWN = 'DOWN';
var STATUS_IDLE = 'IDLE';
// ***********************

var monitors = [];
var stat={
          requests: 0,
          post_count: 0,
          exceptions: 0,
          get_count: 0,
          active: 0,
          time: 0,
          avr_time: 0,
          min_time: 0,
          max_time: 0,
          net_time: 0,
          avr_net_time: 0,
          min_net_time: MAX_VALUE,
          max_net_time: 0,
          resp_time: 0,
          avr_resp_time: 0,
          min_resp_time: MAX_VALUE,
          max_resp_time: 0,
          bytes_read: 0,
          bytes_written: 0,
          '1xx': 0,
          '2xx': 0,
          '3xx': 0,
          '4xx': 0,
          timeout: 0,
          '5xx': 0,
};

function createMon() {
    // monitored data structure
    var mon = {
        // options
        'collect_all' : false,
        'indexPathNames': 0,
        // fixed part
        'server' : null,
        'listen' : "",
        'requests' : 0,
        'post_count' : 0,
        'exceptions' : 0,
        'get_count' : 0,
        'active' : 0,
        // Total
        'time' : 0,
        'avr_time' : 0,
        'min_time' : MAX_VALUE,
        'max_time' : 0,
        // Network latency
        'net_time' : 0,
        'avr_net_time' : 0,
        'min_net_time' : MAX_VALUE,
        'max_net_time' : 0,
        // Server responce time
        'resp_time' : 0,
        'avr_resp_time' : 0,
        'min_resp_time' : MAX_VALUE,
        'max_resp_time' : 0,
        // Read/Writes
        'bytes_read' : 0,
        'bytes_written' : 0,
        // Status codes
        '1xx' : 0,
        '2xx' : 0,
        '3xx' : 0,
        '4xx' : 0,
        'timeout' : 0,// status code 408
        '5xx' : 0,
        'timeS' : new Date().getTime(),
        'timeE' : new Date().getTime(),
        'status' : STATUS_IDLE,
        // flexible part
        'info' : {
            'add' : function(name, key, value) {
                if (!this[name]) {
                    this[name] = {};
                }
                if (this[name][key]) {
                    this[name][key] += value != undefined ? value : 1;
                } else {
                    this[name][key] = value != undefined ? value : 1;
                }
            },
            'addPathNames' : function(path_obj) {
                var self = this;
                if (TOP_VIEW <= 0 || TOP_LIMIT <= 0
                        || (typeof (path_obj['max_time']) == 'number' && (TOP_TIMELIMIT * 1000 > path_obj['max_time']))) {
                    return;
                }
                if (!self['paths']) {
                    self['paths'] = {};
                    mon.indexPathNames = 0;
                }
                var obj = self['paths'];
                var pathname = path_obj['path'];
                var time = path_obj['max_time'];
                var rate = path_obj['rate'];
                var count = path_obj['count'];
                var hash = utils.hashCode(pathname);
                if (obj[hash] == undefined) {// adds a new item
                    if (mon.indexPathNames >= TOP_LIMIT) {
                        return;
                    }
                    obj[hash] = {// update existing item
                        'path' : pathname,
                        'max_time' : time,
                        'rate' : (rate != undefined ? rate : time),
                        'count' : (count != undefined ? count : 1)
                    };
                    mon.indexPathNames++;
                } else {
                    if (obj[hash]['path'] == pathname) {
                        obj[hash]['count'] += (count != undefined ? count : 1);
                        obj[hash]['max_time'] = Math.max(obj[hash]['max_time'], time);
                        obj[hash]['rate'] += (rate != undefined ? rate : time);
                    }
                }
            },
            'addSorted' : function(name, data, sort_key_value) {
                var value = sort_key_value/1000;
                if (TOP_VIEW <= 0 || TOP_TIMELIMIT > value) {
                    return;
                }
                if (!this[name]) {
                    this[name] = [];
                }
                var t = {
                    't' : value,
                    'data' : data
                };
                this[name].push(t);
                if (this[name].length > 1) {
                    this[name].sort(function(a, b) {
                        return b['t'] - a['t'];
                    })
                }
                if (this[name].length > TOP_VIEW) {
                    this[name].pop();
                }
            },
            'addAll' : function(info) {
                var self = this;
                var _name = "";
                function isArray(obj) {
                    return obj.constructor == Array;
                }
                JSON.stringify(info, function(key, value) {
                    if (typeof (value) == 'object') {
                        if (isArray(value)) {
                            value.forEach(function(element, index, value) {
                                self.addSorted(key, element['data'], element['t'])
                            }, self);
                            return undefined;
                        } else {
                            _name = key;
                            if (value['path'] && value['max_time']) {
                                self.addPathNames({'path':value['path'], 'max_time':value['max_time'], 'rate':value['rate'], 'count':value['count']});
                                return undefined;
                            }
                        }
                    } else if (typeof (value) != 'function' && _name.length > 0) {
                        self.add(_name, key, value);
                    }
                    return value;
                });
            }
        }

    };
    return mon;
}

/**
 * Adds the given server to the monitor chain
 * 
 * @param server
 *            {Object}
 * @param options
 *            {Object} the options for given server monitor 
 *            {'collect_all': ('yes' | 'no'), 'top':{'max':<value>, 'limit':<value>, 'sortby':<value>}} 
 *      where 
 *            top.view - the number of viewable part of collected requests
 *            top.limit - the maximum number of collected requests that spent most time for execution 
 *            top.timelimit - the monitor have to collect info when exceeding the number of specified seconds only
 *            top.sortby - sorting by {max_time | rate | count | load}
 *            default - {'collect_all': 'no', 'top':{'view':3,'limit':100, 'timelimit':1, 'sortby': 'max_time'}}
 * @returns {Object} mon_server structure if given server added to the monitor chain 
 *                  null if server is already in monitor
 */
function addToMonitors(server, options) {
    
    var collect_all = false;
    if ('object' == typeof(options)) {
        collect_all = (options['collect_all'] && options['collect_all'] == 'yes') ? true : false;
        if (options['top']) {
            if (typeof(options['top']['view']) == 'number') {
                TOP_VIEW = Math.max(TOP_VIEW, Math.max(options['top']['view'], 0));
            }
            if (typeof(options['top']['limit']) == 'number') {
                TOP_LIMIT = Math.max(options['top']['limit'], 0);
            }
            if (typeof(options['top']['timelimit']) == 'number') {
                TOP_TIMELIMIT = 1000*Math.max(options['top']['timelimit'], 0);
            }
            if (typeof(options['top']['sortby']) == 'string' &&
                (options['top']['sortby'] == 'max_time' || options['top']['sortby'] == 'rate' || 
                 options['top']['sortby'] == 'count' || options['top']['sortby'] == 'load')) {
                TOP_SORTBY = options['top']['sortby'];
            }
        }
        
    }

    if (server && (monitors.length == 0 || !monitors.some(function(element) {return element['server'] == server;}))) {
        var mon_server = createMon();
        mon_server['collect_all'] = collect_all;
        mon_server['server'] = server;
        var address = server.address();
        var host = '0.0.0.0';
        var port = 'n.a';
        if (address){
            port = address['port'];
            host = address['address'];
        } 
        mon_server['listen'] = port;
        monitors.push(mon_server);
        return mon_server;
    }
    //logger.warn("Could not add the same server");
    return null;
}

/**
 * Removes given server from monitor chain
 * 
 * @param server
 */
function removeFromMonitor(server) {
        if (server && monitors.length > 0) {
                for ( var i = 0; i < monitors.length; i++) {
                        var mon_server = monitors[i];
                        if (mon_server['server'] == server) {
                                monitors.splice(i, 1);// remove monitored element
                        }
                }
        }
}

function addExceptionToMonitor(server, callback) {
        var ret = false;
        if (server && monitors.length > 0) {
                for ( var i = 0; i < monitors.length; i++) {
                        var mon_server = monitors[i];
                        if (mon_server['server'] == server && mon_server.hasOwnProperty('exceptions')) {
                                ++mon_server['exceptions'];
                                ret = true;
                                break;
                        }
                }
        }
        return (callback ? (callback(!ret)) : (ret));
}



/**
 * Removes given server from monitor chain
 * 
 * @param server
 */

/**
 * Adds measured values into monitor
 * @param server    monitored server
 * @param requests  count of requests
 * @param post_count count of POST requests
 * @param get_count count of GET requests
 * @param params    object that contains measured results
 * @param status_code response status code
 * @param callback  function(error)
 * @returns true on succes
 */
function addResultsToMonitor(server, requests, post_count, get_count, params, status_code, callback) {
    var ret = false;
    
    if (server && monitors.length > 0 && typeof params == 'object') {
        
        var pathname = params['pathname'];
        var net_duration = params['net_duration']; 
        var pure_duration = params['pure_duration']; 
        var total_duration = params['total_duration']; 
        var bytes_read = params['Read'];
        var bytes_written = params['Written']; 
        var info = params['info']; 
        var userInfo = params['user'];
        for ( var i = 0; i < monitors.length; i++) {
            var mon_server = monitors[i];
            if (mon_server['server'] == server) {
                mon_server['time'] += total_duration;
                mon_server['min_time'] = Math.min(total_duration, mon_server['min_time']);
                if (status_code != 408)// timeout shouldn't be calculated
                    mon_server['max_time'] = Math.max(total_duration, mon_server['max_time']);
                mon_server['resp_time'] += pure_duration;
                mon_server['min_resp_time'] = Math.min(pure_duration, mon_server['min_resp_time']);
                if (status_code != 408)// timeout shouldn't be calculated
                    mon_server['max_resp_time'] = Math.max(pure_duration, mon_server['max_resp_time']);
                mon_server['net_time'] += net_duration;
                mon_server['min_net_time'] = Math.min(net_duration, mon_server['min_net_time']);
                if (status_code != 408)// timeout shouldn't be calculated
                    mon_server['max_net_time'] = Math.max(net_duration, mon_server['max_net_time']);
                mon_server['active'] += ((net_duration + pure_duration) / 1000);
                mon_server['requests'] += requests;
                mon_server['avr_time'] = mon_server['time'] / mon_server['requests'];
                mon_server['avr_resp_time'] = mon_server['resp_time'] / mon_server['requests'];
                mon_server['avr_net_time'] = mon_server['net_time'] / mon_server['requests'];
                mon_server['post_count'] += post_count;
                mon_server['get_count'] += get_count;
                mon_server['bytes_read'] += bytes_read;
                mon_server['bytes_written'] += bytes_written;
                mon_server['1xx'] += (status_code < 200 ? 1 : 0);
                mon_server['2xx'] += (status_code >= 200 && status_code < 300 ? 1 : 0);
                mon_server['3xx'] += (status_code >= 300 && status_code < 400 ? 1 : 0);
                mon_server['4xx'] += (status_code >= 400 && status_code < 500 ? 1 : 0);
                mon_server['5xx'] += (status_code >= 500 ? 1 : 0);
                mon_server['timeout'] += (status_code == 408 ? 1 : 0);// DEBUG
                mon_server['timeE'] = new Date().getTime();
                if (typeof(info) == 'object') {
                    mon_server['info'].addAll(info);
                }
                if (typeof(userInfo) == 'object') {
                    mon_server['info'].addSorted('top' + TOP_VIEW, userInfo, total_duration);
                }
                if (pathname){
                    mon_server['info'].addPathNames({'path':pathname, 'max_time':total_duration});
                }
                ret = true;
                break;
            }
        }
    }
    
    return (callback ? (callback(ret)) : (!ret));
}


/**
 * Composes all monitored servers data in following form <server1 data string> <server2 data string> ......
 * 
 * @param clean
 *            (optional) if given, 
 *            it is forcing to clear all accumulated data after composing a summarized result string
 * 
 * @returns {String}
 */
function getMonitorAllResults(clean) {
        var res = "";
        for ( var i = 0; i < monitors.length; i++) {
                res += monitorResultsToString(monitors[i]);
                res += "\n";
        }
        if (clean) {
                cleanAllMonitorResults();
        }
        return res;
}

/**
 * Returns total (summarized) monitored results
 * 
 * @param clean
 *            (optional) if given, 
 *            it is forcing to clear all accumulated data after composing a summarized result string
 * @returns {String} the total monitored result string
 */


var getMonitorTotalResult = function (clean) {
    var sum = createMon();
    for ( var i = 0; i < monitors.length; i++) {
        var mon = monitors[i];
        if (sum['listen'].length <= 0) {
            sum['listen'] = mon['listen'];
        } else {
            sum['listen'] += ',' + mon['listen'];
        }
        sum['min_time'] = Math.min(sum['min_time'], mon['min_time']);
        sum['max_time'] = Math.max(sum['max_time'], mon['max_time']);
        sum['time'] += mon['time'];
        sum['min_net_time'] = Math.min(sum['min_net_time'], mon['min_net_time']);
        sum['max_net_time'] = Math.max(sum['max_net_time'], mon['max_net_time']);
        sum['net_time'] += mon['net_time'];
        sum['min_resp_time'] = Math.min(sum['min_resp_time'], mon['min_resp_time']);
        sum['max_resp_time'] = Math.max(sum['max_resp_time'], mon['max_resp_time']);
        sum['resp_time'] += mon['resp_time'];
        sum['exceptions'] += mon['exceptions'];
        sum['active'] += mon['active'];
        sum['requests'] += mon['requests'];
        sum['post_count'] += mon['post_count'];
        sum['get_count'] += mon['get_count'];
        sum['bytes_read'] += mon['bytes_read'];
        sum['bytes_written'] += mon['bytes_written'];
        sum['1xx'] += mon['1xx'];
        sum['2xx'] += mon['2xx'];
        sum['3xx'] += mon['3xx'];
        sum['4xx'] += mon['4xx'];
        sum['5xx'] += mon['5xx'];
        sum['timeout'] += mon['timeout'];
        sum['timeS'] = Math.min(sum['timeS'], mon['timeS']);
        sum['timeE'] = Math.max(sum['timeE'], mon['timeE']);
        sum.info.addAll(mon.info);
    }
    if (sum['active'] <= 0) {
        sum['avr_time'] = 0;
        sum['avr_resp_time'] = 0;
        sum['avr_net_time'] = 0;
    } else {
        sum['avr_time'] = sum['time'] / sum['requests'];
        sum['avr_resp_time'] = sum['resp_time'] / sum['requests'];
        sum['avr_net_time'] = sum['net_time'] / sum['requests'];
    }
    if (clean) {
        cleanAllMonitorResults();
    }
    if (sum['listen'].length == 0) {
        sum['status'] = STATUS_DOWN;
    } else if (sum['requests'] == 0) {
        sum['status'] = STATUS_IDLE;
    } else if ((sum['max_net_time'] != 0 && sum['avr_net_time'] / sum['max_net_time'] > 0.9)
            || (sum['max_resp_time'] != 0 && sum['avr_resp_time'] / sum['max_resp_time'] > 0.9)) {
        sum['status'] = STATUS_NOK;
    } else {
        sum['status'] = STATUS_OK;
    }
    return sum;
}



function cleanAllMonitorResults() {
        for ( var i = 0; i < monitors.length; i++) {
                monitors[i] = monitorResultsClean(monitors[i]);
        }
}


function cleanMonitorResults(server) {
        var ret = false;

        if (server && monitors.length > 0) {
                for ( var i = 0; i < monitors.length; i++) {
                        if (monitors[i]['server'] == server) {
                                monitors[i] = monitorResultsClean(monitors[i]);
                                ret = true;
                                break;
                        }
                }
        }
        return ret;
}

function monitorResultsClean(mon_server) {
        var server = mon_server['server'];
        var listen = mon_server['listen'];
        var timeS = mon_server['timeS'];

        var mon = createMon();

        mon['server'] = server;
        mon['listen'] = listen;
        mon['timeE'] = timeS;
        return mon;
}

/**
 * Composes the flexible info part of data NOTE: this part is very specific and depends on possible server requests
 * 
 * @param request
 *            {Object} the HTTP(S) request object that holds a required information
 * @param collect_all
 *            {boolean} true value indicates to collecting all possible information
 * @returns the composed flexible info object
 */
function getRequestInfo(request, collect_all) {
        var tmp = createMon();
        var value = request.headers['mon-platform'];
        if (value && value.length > 0) {
                tmp.info.add('platform', value);
        }
        value = request.headers['mon-version'];
        if (value && value.length > 0) {
                tmp.info.add('version', value);
        }
        if (collect_all) {
                value = request.headers['mon-email'];
                if (value && value.length > 0) {
                        tmp.info.add('email', value);
                }
                value = request.headers['mon-aname'];
                if (value && value.length > 0) {
                        tmp.info.add('aname', value);
                }
                value = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress
                                || request.connection.socket.remoteAddress || 0;
                if (value && value.length > 0) {
                        tmp.info.add('access_from', value);
                }
        }
        return tmp.info;
}

/**
 * 
 * @param request
 * @returns OBJECT with user info
 */
function getUserInfo(request, collect_all) {
        if (collect_all) {
                var tmp = {};
                var value = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress
                                || request.connection.socket.remoteAddress;
                if (value && value.length > 0) {
                        tmp['ip'] = value;
                }
                value = request.headers['host'];
                if (value && value.length > 0) {
                        tmp['host'] = value;
                }
        return tmp;
        }
}

var Monitor = function(server, options) {
    worker = options.worker;
    
    if(worker){
        setInterval(function() {
            process.send(getMonitorTotalResult(true));
     }, 4000);
    }
    
    var mon_server = addToMonitors(server, options);
    
    if (mon_server && mon_server != null) {

        server.on('request', function(req, res) {           
            req.setMaxListeners(0);
            var params = {};
            params['timeS'] = new Date().getTime();//
            params['pathname'] = utils.cleanURL(url.parse(req.url).pathname).trim().toLowerCase();
            params['Method'] = req.method;
            params["content-length"] = req.headers['content-length'];
            params['info'] = getRequestInfo(req, mon_server['collect_all']);
            params['user'] = getUserInfo(req, mon_server['collect_all']);

            req.on('add_data', function(obj) {
                params['net_time'] = obj['net_time'] || 0;
            })

            req.on('end', function() {
                var net_time = new Date().getTime();
                params['net_time'] = net_time;
            })

            var socket = req.socket;
            var csocket = req.connection.socket;
            // listener for response finishing
            if (req.socket) {
                req.socket.setMaxListeners(0);
                
                req.socket.on('error', function(err) {
                    //logger.error("******SOCKET.ERROR****** " + err + " - " + (new Date().getTime() - params['timeS']));
                })
                req.socket.on('close', function() {
                    params['timeE'] = new Date().getTime();
                    params['pure_duration'] = (params['timeE'] - (params['net_time'] || params['timeE']));
                    params['net_duration'] = ((params['net_time'] || params['timeE']) - params['timeS']);
                    params['total_duration'] = (params['timeE'] - params['timeS']);
                    try {
                        params['Read'] = socket.bytesRead || csocket.bytesRead;
                    } catch (err) {
                        params['Read'] = 0;
                    }
                    try {
                        params['Written'] = socket.bytesWritten || csocket.bytesWritten;
                    } catch (err) {
                        params['Written'] = 0;
                    }
                    try {
                        params['Status'] = res.statusCode;
                    } catch (err) {
                        params['Status'] = 0;
                    }
                    params['Uptime'] = process.uptime();

                    if (params['Written'] == 0) {

                    }
                    addResultsToMonitor(server, 1, (req.method == "POST" ? 1 : 0), (req.method == "GET" ? 1 : 0),
                            params, res.statusCode, function(error) {
                      
                            });
                }); 
        } else {  
                res.setMaxListeners(0);
                
                res.on('finish', function() {
                    params['timeE'] = new Date().getTime();
                    params['pure_duration'] = (params['timeE'] - (params['net_time'] || params['timeE']));
                    params['net_duration'] = ((params['net_time'] || params['timeE']) - params['timeS']);
                    params['total_duration'] = (params['timeE'] - params['timeS']);
                    console.log(params['total_duration']);

                    try {
                        params['Read'] = socket.bytesRead || csocket.bytesRead;
                    } catch (err) {
                        params['Read'] = 0;
                    }
                    try {
                        params['Written'] = socket.bytesWritten || csocket.bytesWritten;
                    } catch (err) {
                        params['Written'] = 0;
                    }
                    try {
                        params['Status'] = res.statusCode;
                    } catch (err) {
                        params['Status'] = 0;
                    }
                    params['Uptime'] = process.uptime();
                    
                    addResultsToMonitor(server, 1, (req.method == "POST" ? 1 : 0), (req.method == "GET" ? 1 : 0),
                            params, res.statusCode, function(error) {
                      
                            });

                });
            }
        });
        
        // listener for server closing
        server.on('close', function(errno) {
            removeFromMonitor(server);
        })

        events.EventEmitter.call(this);
    }   
}

var setListener = function(cluster){
    Object.keys(cluster.workers).forEach(function(id) {
        cluster.workers[id].on('message', function(data){
            if(data.requests>0){
              stat.requests +=data.requests;
              stat.post_count +=data.post_count;
              stat.exceptions +=data.exceptions
              stat.get_count +=stat.get_count;
              //stat.active=
              //stat.time=
              //stat.avr_time=
              //stat.min_time=
              //stat.max_time=
              //stat.net_time=
              //stat.avr_net_time=
              //stat.min_net_time=
              //stat.max_net_time=
              stat.resp_time+=data.resp_time;
              stat.avr_resp_time=(stat.resp_time/stat.requests).toFixed(2);
              stat.min_resp_time=Math.min(stat.min_resp_time,data.min_resp_time);
              stat.max_resp_time=Math.max(stat.max_resp_time,data.max_resp_time);
              stat.bytes_read+=data.bytes_read;
              stat.bytes_written+=data.bytes_written;
              stat['1xx']+=data['1xx'];
              stat['2xx']+=data['2xx'];
              stat['3xx']+=data['3xx'];
              stat['4xx']+=data['4xx'];
              stat['5xx']+=data['5xx'];
                
            }
        }
        );
      });
    
}

 
var getStat = function(){
    /*var temp={};
    for(var key in stat)
        temp[key] = stat[key];
    temp.avr_resp_time=(temp.avr_resp_time/1000).toFixed(2);
    temp.min_resp_time=(temp.min_resp_time/1000).toFixed(2);
    temp.max_resp_time=(temp.max_resp_time/1000).toFixed(2);
    return temp;*/
    return stat;
}

module.exports={
    Monitor:Monitor,
    getTotalResult:getMonitorTotalResult,
    addExceptionToMonitor:addExceptionToMonitor,
    setListener:setListener,
    getStat:getStat
}

