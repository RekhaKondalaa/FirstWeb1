const enterMarksBtn = document.getElementById('enter-marks-btn');
const marksForm = document.getElementById('marks-form');
const sectionsList = document.getElementById('sections-list');
const classesList = document.getElementById('classes-list');
const marksTableContainer = document.getElementById('marks-table-container');
const marksTableBody = document.getElementById('marks-table-body');

enterMarksBtn.addEventListener('click', () => {
    marksForm.style.display = 'block';
});

sectionsList.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const section = e.target.dataset.section;
        console.log(`Section selected: ${section}`);
        // generate table rows for the selected section
        generateTableRows(section);
    }
});

classesList.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const classSelected = e.target.dataset.class;
        console.log(`Class selected: ${classSelected}`);
        // generate table rows for the selected class
        generateTableRows(classSelected);
    }
});

const { useState, useEffect } = React;

// Define schools data with student names
const schools = [
    { name: 'SCHOOL-A', students: generateStudents('A') },
    { name: 'SCHOOL-B', students: generateStudents('B') },
    { name: 'SCHOOL-C', students: generateStudents('C') },
    { name: 'SCHOOL-D', students: generateStudents('D') },
    { name: 'SCHOOL-E', students: generateStudents('E') },
    { name: 'ALL', students: generateStudents('A','B','C','D','E') },
];


// Helper function to generate sample students
function generateStudents(suffix) {
    const students = [];
    for (let i = 1; i <= 100; i++) {
        students.push({
            id: `${suffix}-${i}`,
            studentName: `Student ${i}`, // Adding student name
            examAttended: 'Y',
            thelugu: [0, 0, 0, 0],
            hindi: [0, 0, 0, 0],
            english: [0, 0, 0, 0],
            mathematics: [0, 0, 0, 0],
            science: [0, 0, 0, 0],
            socialStudies: [0, 0, 0, 0],
        });
    }
    return students;
}

// Grade calculation functions
const calculateTotal = marks => marks.reduce((a, b) => a + b, 0);

const calculateGrade = total => {
    if (total <= 9) return 'D';
    if (total <= 19) return 'C';
    if (total <= 29) return 'B';
    if (total <= 39) return 'B+';
    if (total <= 45) return 'A';
    return 'A+';
};

// React component
function StudentMarksEntry() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        if (selectedSchool === 'ALL') {
            setStudents(schools.flatMap(s => s.students));
        } else {
            const school = schools.find(s => s.name === selectedSchool);
            setStudents(school ? school.students : []);
        }
    }, [selectedSchool]);

    const handleInputChange = (index, field, value, subjectIndex) => {
        const newStudents = [...students];
        const student = newStudents[index];

        if (field === 'examAttended' || field === 'studentName') {
            student[field] = value;
        } else {
            const maxMarks = [10, 10, 10, 20];

            if (value > maxMarks[subjectIndex]) {
                alert("ENTER THE MARKS ACCORDING TO LIMIT");
                return;
            }

            student[field][subjectIndex] = Number(value);

            student[`${field}Total`] = calculateTotal(student[field]);
            student[`${field}Grade`] = calculateGrade(student[`${field}Total`]);

            student.grandTotal = calculateTotal([
                student.theluguTotal || 0,
                student.hindiTotal || 0,
                student.englishTotal || 0,
                student.mathematicsTotal || 0,
                student.scienceTotal || 0,
                student.socialStudiesTotal || 0,
            ]);

            student.totalGrade = calculateGrade(student.grandTotal);
        }

        setStudents(newStudents);
    };

    const handleSearchInput = event => {
        const term = event.target.value;
        setSearchTerm(term);
    };

    const renderSearchSuggestions = () => {
        const suggestions = schools.filter(school => school.name.includes(searchTerm.toUpperCase()));
        return suggestions.map(school => (
            <li key={school.name} onClick={() => setSelectedSchool(school.name)}>
                {school.name}
            </li>
        ));
    };

    const renderTableRows = () => {
        return students.map((student, index) => (
            <tr key={student.id}>
                <td>{index + 1}</td>
                <td>
                    <input
                        type="text"
                        value={student.studentName}
                        onChange={e => handleInputChange(index, 'studentName', e.target.value)}
                    />
                </td>
                <td>{student.id}</td>
                <td><input type="text" value={student.examAttended} onChange={e => handleInputChange(index, 'examAttended', e.target.value)} /></td>
                {['thelugu', 'hindi', 'english', 'mathematics', 'science', 'socialStudies'].map(subject => (
                    <td key={subject}>
                        <div className="sub-columns">
                            {student[subject].map((mark, i) => (
                                <input
                                    key={i}
                                    type="number"
                                    value={mark}
                                    onChange={e => handleInputChange(index, subject, e.target.value, i)}
                                />
                            ))}
                            <input type="number" value={student[`${subject}Total`] || 0} readOnly />
                            <input type="text" value={student[`${subject}Grade`] || ''} readOnly />
                        </div>
                    </td>
                ))}
                <td>{student.grandTotal || 0}</td>
                <td>{student.totalGrade || ''}</td>
            </tr>
        ));
    };

    return (
        <div>
            <header>
                <input
                    type="search"
                    id="search-bar"
                    placeholder="Search school..."
                    value={searchTerm}
                    onChange={handleSearchInput}
                />
                <ul id="search-suggestions">{searchTerm && renderSearchSuggestions()}</ul>
            </header>
            <main>
                <table id="marks-table">
                    <thead>
                        <tr>
                            <th>SNO</th>
                            <th>STUDENT NAME</th> {/* New Column */}
                            <th>ID / PEN Number</th>
                            <th>Exam Attended</th>
                            <th>Thelugu</th>
                            <th>Hindi</th>
                            <th>English</th>
                            <th>Mathematics</th>
                            <th>Science</th>
                            <th>Social Studies</th>
                            <th>Grand Total</th>
                            <th>Total Grade</th>
                        </tr>
                    </thead>
                    <tbody id="marks-table-body">{renderTableRows()}</tbody>
                </table>
            </main>
        </div>
    );
}

// Render the component to the DOM
ReactDOM.render(<StudentMarksEntry />, document.getElementById('root'));
