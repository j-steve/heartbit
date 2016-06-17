'use strict';
const Promise = require('bluebird');
const MySQL = require('mysql');

const pool = MySQL.createPool({
  host     : 'heartbit.cqpasazcowgm.us-west-2.rds.amazonaws.com',
  user     : 'heartbit_admin',
  password : 'adminPass',
  database : 'heartbit_data'
});

pool.on('enqueue', function () {
	console.warn('Waiting for available connection slot');
});

pool.on('error', function (err) {
	console.error(err.message);
});
	 
function DbConnection(initialConn) { 
	var self = this;
	
	this.getConnection = function() {
		return getRawConnection().then(conn => new DbConnection(conn));
	};
	
	this.transaction = function(transCallback) {
		if (typeof transCallback !== 'function') {throw new TypeError('Invalid argument type, transaction requires a function argument.');}
		
		return self.getConnection().then(function(conn) {
			return conn.executeSql('START TRANSACTION').then(function() {
				conn.commit = () => conn.executeSql('COMMIT');
				conn.rollback = () => conn.executeSql('ROLLBACK');
				return transCallback(conn).tap(conn.commit).catch(err => {conn.rollback(); throw err;});
			});
		});
	};

	this.batchInsert = function(tableName, columns, values) {
		if (!values) {throw new Error('Values cannot be null.');}
		
		if (!values.length) {
		    return Promise.resolve(0);
		} else {
		    return self.executeSql('INSERT INTO ?? (??) VALUES ?', tableName, columns, values).then(result => result.affectedRows);
		}
	};

	this.selectOne = function(tableName, where) {
		return self.executeSql("SELECT * FROM ??" + self.where(where), tableName).then(function(rows, fields) {
			if (rows.length > 1) {throw new Error(`Too many matching rows returned: expected 1, got ${rows.length}.`);}
			return rows.length ? rows[0] : null;
		});
	};

	this.executeSql = function(sql, ...values) {
		var nullIndex = values.findIndex(x => x == null);
		if (nullIndex !== -1) {throw new Error(`Contains null or undefined value at index ${nullIndex + 1}.`);}
		
		var sqlStmt = self.format(sql, values);
		return getRawConnection().then(conn => Promise.promisify(conn.query).call(conn, sqlStmt));
	};
	
	this.where = function(where) {
		if (typeof where === 'object') {
			var fields = Object.keys(where).map(function(field) {
				var value = where[field];
				var txt = MySQL.escapeId(field);
				if (value == null) {
					txt += ' IS NULL';
				} else {
					txt += (typeof value === 'object') ? ' IN ' : ' = ';
					txt += MySQL.escape(value);
				}
				return txt;
			});
			where = fields.join(' AND ');
		}
		return ' WHERE ' + where;
	};
	
	this.format = MySQL.format;
	
	
	function getRawConnection() { 
		return new Promise(function (resolve, reject) {
			if (initialConn) {
			    resolve(initialConn);
			} else {
    			pool.getConnection(function(err, conn) {
    				if (err) {
    					reject(err);
    				} else {
    					resolve(conn);
    					conn.release();
    				}
    			});
			}
		});
	}
	
}

module.exports = new DbConnection();