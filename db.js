/**
 * Created by bingofree on 2016/8/13.
 */
var oracledb = require('oracledb');

oracledb.getConnection(
    {
        user: "SYSTEM",
        password: "123456",
        connectString: "localhost/XE"
    },
    function (err, connection) {
        if (err) {
            console.error(err.message);
            return;
        }

        connection.execute(
            "SELECT c,dbms_lob.substr(mylobs.c,1000,1) as b FROM mylobs WHERE id = :id",
            {id: 1},
            function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                if (result.rows.length === 0) {
                    console.log('length == 0');
                    return;
                }

                var clob = '';
                var lob = result.rows[0][0];  // just show first record
                console.log("bingofree:"+result.rows[0][1]);
                if (lob === null) {
                    console.log('CLOB was NULL');
                    return;
                }
                lob.setEncoding('utf8');      // set the encoding so we get a 'string' not a 'buffer'
                lob.on('data',
                    function (chunk) {
                        clob += chunk;
                    });
                lob.on('close',
                    function () {
                        //var js = JSON.parse(clob);
                        var js = clob;
                        console.log('Query results: ', js);
                        return;
                    });
                lob.on('error',
                    function (err) {
                        console.log(err);
                        return;
                    });
            });
    });
