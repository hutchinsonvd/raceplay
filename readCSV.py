import psycopg
import re

# class People:
#   def __init__(self, id, name, nationality, date_of_birth, year_of_birth, image):
#     self.id = id
#     self.name = name
#     self.nationality = nationality
#     self.date_of_birth = date_of_birth
#     self.year_of_birth = year_of_birth
#     self.image = image


# file = open("wd_people.csv", "r", encoding='utf-8')
# lines = file.readlines()
# count = 0

# peoples = []

# for line in lines:

#     if (count < 101 ): 
#         count = count + 1
#         continue
    
#     result = re.split('\t', line)
#     person = People(id=result[0], name=result[1], nationality=result[2], date_of_birth=result[3], year_of_birth=result[4], image=result[5].removesuffix('\n'))
#     peoples.append(person)
#     count = count + 1

# file.close()

# print("done with file")


# Connect to an existing database
with psycopg.connect("postgres://raceplay_user:HvZhjXOrYBVXXmiCaCCo1zShsasn8Nqq@dpg-cpmuli6ehbks73fvf8qg-a.ohio-postgres.render.com/raceplay") as conn:
    with conn.cursor() as cur:
        
        # get all nationalities and insert into nationalities table

        cur.execute("SELECT DISTINCT nationality FROM people")


        # for p in peoples:

        #     cur.execute(
        #         "INSERT INTO people (id, label, nationality, year_of_birth, image_url) VALUES (%s, %s, %s, %s, %s) ON CONFLICT DO NOTHING",
        #         (p.id, p.name, p.nationality, p.year_of_birth, p.image))
        
        #cur.execute("SELECT * FROM nationalities")
        result = cur.fetchall()

        # You can use `cur.fetchmany()`, `cur.fetchall()` to return a list
        # of several records, or even iterate on the cursor
        for record in result:
            formattedNat = record[0]
            cur.execute("INSERT INTO nationalities (nationality) VALUES (%s)", [formattedNat])

        # Make the changes to the database persistent
        conn.commit()

        cur.execute("SELECT * FROM nationalities")
        result = cur.fetchall()
        # will return (1, 100, "abc'def")

        # You can use `cur.fetchmany()`, `cur.fetchall()` to return a list
        # of several records, or even iterate on the cursor
        for record in cur:
            print(record)

print("done")

