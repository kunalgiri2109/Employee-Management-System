app.get('/fetchAllDepartments', (req, res) => {
    // Fetch all departments from the database
    db.select('*').from('departments')
      .then((departments) => {
        res.json(departments);
      })
      .catch((error) => {
        console.error('Error fetching departments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  });
