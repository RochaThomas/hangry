import os
import sqlalchemy

# a cursor is the object we use to interact with the database
import pymysql.cursors
# this class will give us an instance of a connection to our database

from google.cloud.sql.connector import Connector, IPTypes

# db_user = os.environ.get('CLOUD_SQL_USERNAME')
# db_password = os.environ.get('CLOUD_SQL_PASSWORD')
# db_name = os.environ.get('CLOUD_SQL_DB_NAME')
# db_connection_name = os.environ.get('CLOUD_SQL_CONNECTION_NAME')

class MySQLConnection:
    def __init__(self, db):
        instance_connection_name = "hangry-343110:us-west1:hangry-backend"
        ip_type = IPTypes.PRIVATE if os.environ.get("PRIVATE_IP") else IPTypes.PUBLIC

        connector = Connector(ip_type)

        def getconn() -> pymysql.connections.Connection:
            conn: pymysql.connections.Connection = connector.connect(
                instance_connection_name,
                "pymysql",
                user="root",
                password="PCK21RslvzG,6B@Z",
                db="hangry_schema"
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


        # with self.connection.cursor() as cursor:
        #     try:
        #         query = cursor.mogrify(query, data)
        #         print("Running Query:", query)
                
        #         cursor.execute(query, data)
        #         if query.lower().find("insert") >= 0:
        #             # INSERT queries will return the ID NUMBER of the row inserted
        #             self.connection.commit()
        #             return cursor.lastrowid
        #         elif query.lower().find("select") >= 0:
        #             # SELECT queries will return the data from the database as a LIST OF DICTIONARIES
        #             result = cursor.fetchall()
        #             return result
        #         else:
        #             # UPDATE and DELETE queries will return nothing
        #             self.connection.commit()
        #     except Exception as e:
        #         # if the query fails the method will return FALSE
        #         print("Something went wrong", e)
        #         return False
        #     finally:
        #         # close the connection
        #         self.connection.close() 
# connectToMySQL receives the database we're using and uses it to create an instance of MySQLConnection
def connectToMySQL(db):
    return MySQLConnection(db)