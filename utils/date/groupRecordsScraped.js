// Helper functions for grouping records
const groupRecordsByDay = (records) => {
  const groupedByDay = {};
  
  records.forEach(record => {
    const date = new Date(record.date);
    const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    if (!groupedByDay[dayKey]) {
      groupedByDay[dayKey] = {
        id: record.id,
        price: record.price,
        availability: record.availability,
        stock: record.stock,
        date: record.date,
        count: 1
      };
    } else {
      // Calculate average price
      const currentTotal = groupedByDay[dayKey].price * groupedByDay[dayKey].count;
      const newTotal = currentTotal + record.price;
      groupedByDay[dayKey].count++;
      groupedByDay[dayKey].price = newTotal / groupedByDay[dayKey].count;
      
      // Keep the most recent date
      if (new Date(record.date) > new Date(groupedByDay[dayKey].date)) {
        groupedByDay[dayKey].date = record.date;
      }
    }
  });
  
  return Object.values(groupedByDay);
};

const groupRecordsByWeek = (records) => {
  const groupedByWeek = {};
  
  records.forEach(record => {
    const date = new Date(record.date);
    // Get the week number (1-52)
    const weekNumber = getWeekNumber(date);
    const year = date.getFullYear();
    const weekKey = `${year}-W${weekNumber}`;
    
    if (!groupedByWeek[weekKey]) {
      groupedByWeek[weekKey] = {
        id: record.id,
        price: record.price,
        availability: record.availability,
        stock: record.stock,
        date: record.date,
        count: 1
      };
    } else {
      // Calculate average price
      const currentTotal = groupedByWeek[weekKey].price * groupedByWeek[weekKey].count;
      const newTotal = currentTotal + record.price;
      groupedByWeek[weekKey].count++;
      groupedByWeek[weekKey].price = newTotal / groupedByWeek[weekKey].count;
      
      // Keep the most recent date
      if (new Date(record.date) > new Date(groupedByWeek[weekKey].date)) {
        groupedByWeek[weekKey].date = record.date;
      }
    }
  });
  
  return Object.values(groupedByWeek);
};

const groupRecordsByMonth = (records) => {
  const groupedByMonth = {};
  
  records.forEach(record => {
    const date = new Date(record.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!groupedByMonth[monthKey]) {
      groupedByMonth[monthKey] = {
        id: record.id,
        price: record.price,
        availability: record.availability,
        stock: record.stock,
        date: record.date,
        count: 1
      };
    } else {
      // Calculate average price
      const currentTotal = groupedByMonth[monthKey].price * groupedByMonth[monthKey].count;
      const newTotal = currentTotal + record.price;
      groupedByMonth[monthKey].count++;
      groupedByMonth[monthKey].price = newTotal / groupedByMonth[monthKey].count;
      
      // Keep the most recent date
      if (new Date(record.date) > new Date(groupedByMonth[monthKey].date)) {
        groupedByMonth[monthKey].date = record.date;
      }
    }
  });
  
  return Object.values(groupedByMonth);
};

const groupRecordsByQuarter = (records) => {
  const groupedByQuarter = {};
  
  records.forEach(record => {
    const date = new Date(record.date);
    const quarter = Math.floor(date.getMonth() / 3) + 1;
    const quarterKey = `${date.getFullYear()}-Q${quarter}`;
    
    if (!groupedByQuarter[quarterKey]) {
      groupedByQuarter[quarterKey] = {
        id: record.id,
        price: record.price,
        availability: record.availability,
        stock: record.stock,
        date: record.date,
        count: 1
      };
    } else {
      // Calculate average price
      const currentTotal = groupedByQuarter[quarterKey].price * groupedByQuarter[quarterKey].count;
      const newTotal = currentTotal + record.price;
      groupedByQuarter[quarterKey].count++;
      groupedByQuarter[quarterKey].price = newTotal / groupedByQuarter[quarterKey].count;
      
      // Keep the most recent date
      if (new Date(record.date) > new Date(groupedByQuarter[quarterKey].date)) {
        groupedByQuarter[quarterKey].date = record.date;
      }
    }
  });
  
  return Object.values(groupedByQuarter);
};

const groupRecordsBySemester = (records) => {
  const groupedBySemester = {};
  
  records.forEach(record => {
    const date = new Date(record.date);
    const semester = Math.floor(date.getMonth() / 6) + 1;
    const semesterKey = `${date.getFullYear()}-S${semester}`;
    
    if (!groupedBySemester[semesterKey]) {
      groupedBySemester[semesterKey] = {
        id: record.id,
        price: record.price,
        availability: record.availability,
        stock: record.stock,
        date: record.date,
        count: 1
      };
    } else {
      // Calculate average price
      const currentTotal = groupedBySemester[semesterKey].price * groupedBySemester[semesterKey].count;
      const newTotal = currentTotal + record.price;
      groupedBySemester[semesterKey].count++;
      groupedBySemester[semesterKey].price = newTotal / groupedBySemester[semesterKey].count;
      
      // Keep the most recent date
      if (new Date(record.date) > new Date(groupedBySemester[semesterKey].date)) {
        groupedBySemester[semesterKey].date = record.date;
      }
    }
  });
  
  return Object.values(groupedBySemester);
};

const groupRecordsByYear = (records) => {
  const groupedByYear = {};
  
  records.forEach(record => {
    const date = new Date(record.date);
    const yearKey = date.getFullYear().toString();
    
    if (!groupedByYear[yearKey]) {
      groupedByYear[yearKey] = {
        id: record.id,
        price: record.price,
        availability: record.availability,
        stock: record.stock,
        date: record.date,
        count: 1
      };
    } else {
      // Calculate average price
      const currentTotal = groupedByYear[yearKey].price * groupedByYear[yearKey].count;
      const newTotal = currentTotal + record.price;
      groupedByYear[yearKey].count++;
      groupedByYear[yearKey].price = newTotal / groupedByYear[yearKey].count;
      
      // Keep the most recent date
      if (new Date(record.date) > new Date(groupedByYear[yearKey].date)) {
        groupedByYear[yearKey].date = record.date;
      }
    }
  });
  
  return Object.values(groupedByYear);
};

// Helper function to get week number
const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};


const groupRecordsScraped = {
  groupRecordsByDay,
  groupRecordsByWeek,
  groupRecordsByMonth,
  groupRecordsByQuarter,
  groupRecordsBySemester,
  groupRecordsByYear,
};

module.exports = groupRecordsScraped;
  