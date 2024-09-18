db.createUser(
        {
            user: "youapp-backend-test",
            pwd: "youapp-backend-test",
            roles: [
                {
                    role: "userAdminAnyDatabase",
                    db: "youapp-backend-test"
                },
                "readWriteAnyDatabase"
            ]
        }
);