import os
import sqlalchemy

# a cursor is the object we use to interact with the database
import pymysql.cursors
# this class will give us an instance of a connection to our database

from google.cloud.sql.connector import Connector, IPTypes

db_user = os.environ.get('CLOUD_SQL_USERNAME')
db_password = os.environ.get('CLOUD_SQL_PASSWORD')
db_name = os.environ.get('CLOUD_SQL_DB_NAME')
db_connection_name = os.environ.get('CLOUD_SQL_CONNECTION_NAME')

class MySQLConnection:
    def __init__(self, db):
        ip_type = IPTypes.PRIVATE if os.environ.get("PRIVATE_IP") else IPTypes.PUBLIC

        connector = Connector(ip_type)

        def getconn() -> pymysql.connections.Connection:
            # IF YOU ARE RUNNING LOCALLY OR DEPLOYING CHANGE THE VALUES BELOW
            # CHANGE DB CONNECTION NAME
            # CHANGE USER
            # CHANGE PASSWORD
            # CHANGE DB
            conn: pymysql.connections.Connection = connector.connect(
                db_connection_name,
                "pymysql",
                user=db_user,
                password=db_password,
                db=db_name,
            )
            return conn
        
        pool = sqlalchemy.create_engine(
            "mysql+pymysql://",
            creator=getconn,
            pool_size=5,
            max_overflow=2,
            pool_timeout=30,
            pool_recycle=1800,
        )

        self.connection = pool


        # # ---------------------------------------------------------------------------------------------------------
        # # for connecting to google cloud mysql
        # unix_socket = '/cloudsql/{}'.format(db_connection_name)
        # # change the user and password as needed
        # connection = pymysql.connect(user = db_user, 
        #                             password = db_password, 
        #                             unix_socket = unix_socket,
        #                             db = db,
        #                             charset = 'utf8mb4',
        #                             cursorclass = pymysql.cursors.DictCursor,
        #                             autocommit = True)
        # # establish the connection to the database
        # self.connection = connection
    # the method to query the database
    def query_db(self, query, data=None):
        with self.connection.connect() as conn:
            print("-------------------------------------------------------")
            print("data: ", data)
            if query.lower().find("insert") >= 0:
                res = conn.execute(sqlalchemy.text(query), data)
                conn.commit()
                return res.lastrowid
                # conn.execute(sqlalchemy.text(query), data).commit()
                # return conn.cursor.lastrowid
            elif query.lower().find("select") >= 0:
                res = conn.execute(sqlalchemy.text(query), data).fetchall()
                return res
            else:
                res = conn.execute(sqlalchemy.text(query), data)
                conn.commit()
            conn.close() 
def connectToMySQL(db):
    return MySQLConnection(db)