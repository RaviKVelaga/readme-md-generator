// TODO: Include packages needed for this application
const inquirer = require('inquirer');
const fs = require('fs');
const generateMarkdown = require('./utils/generateMarkdown.js');
// TODO: Create an array of questions for user input
const questions = [
    {
        type: 'input',
        name: 'title',
        message: 'Please provide a project title. (*Required)',
        validate: input => {
            return validateInput(input, 'Please provide a project title');
        }
    },
    {
        type: 'input',
        name: 'github',
        message: 'Please enter your github username. (*Required)',
        validate: input => {
            return validateInput(input, 'Please enter your github username.');
        }
    },
    {
        type: 'input',
        name: 'repo',
        message: 'Please enter the name of the repo. (*Required)',
        validate: input => {
            return validateInput(input, 'Please enter the name of the repo.');
        }
    },
    {
        type: 'input',
        name: 'description',
        message: 'Provide a description of your project. (*Required)',
        validate: input => {
            return validateInput(input, 'Provide a description of your project.');
        }
    },
    {
        type: 'input',
        name: 'usage',
        message: 'Please provide information for using your project. (*Required)',
        validate: input => {
            return validateInput(input, 'Please provide information for using your project.');
        }
    },
    {
        type: 'checkbox',
        name: 'contents',
        message: 'Any additional sections you would like to include in your README?',
        choices: [
            {
                name: 'Deployed Application',
                checked: false
            },
            {
                name: 'Installation',
                checked: false
            },
            {
                name: 'Screenshots',
                checked: true
            },
            {
                name: 'TechUsed',
                checked: false
            },
            {
                name: 'License',
                checked: false
            },
            {
                name: 'Questions',
                checked: true
            }
        ]

    },
    {
        type: 'input',
        name: 'link',
        message: 'please provide a link to your deployed project.',
        when: ({ contents }) => {
            if (contents.indexOf('Link') > -1) {
                return true;
            }
            else {
                return false;
            }
        },
        validate: input => {
            return validateInput(input, 'please provide a link to your deployed project.');
        }
    },
    {
        type: 'input',
        name: 'installation',
        message: 'Please list any required packages for installation of your project.',
        when: ({ contents }) => {
            if (contents.indexOf('Installation') > -1) {
                return true;
            }
            else {
                return false;
            }
        },
        validate: input => {
            return validateInput(input, 'Please list any required packages for installation of your project.');
        }
    },
    {
        type: 'list',
        name: 'license',
        message: 'Please provide license information.',
        choices: ['MIT', 'GNU', 'ISC'],
        default: 0,
        when: ({ contents }) => {
            if (contents.indexOf('License') > -1) {
                return true;
            }
            else {
                return false;
            }
        },
        validate: input => {
            return validateInput(input, 'Please provide license information.');
        }
    },
    {
        type: 'list',
        name: 'TechStackUsed',
        message: 'Please select the technologies that your project was following tech stack.',
        choices: ['HTML', 'CSS', 'C++', 'JAVA', 'javascript', 'Node.js'],
        default: 0,
        when: ({ contents }) => {
            if (contents.indexOf('TechUsed') > -1) {
                return true;
            }
            else {
                return false;
            }
        },
        validate: input => {
            return validateInput(input, 'Please select the technologies that your project was built with.');
        }
    },
    {
        type: 'input',
        name: 'contributing',
        message: 'Please enter your guidelines for contributing.',
        when: ({ contents }) => {
            if (contents.indexOf('Contributing') > -1) {
                return true;
            }
            else {
                return false;
            }
        },
        validate: input => {
            return validateInput(input, 'Please enter your guidelines for contributing.');
        }
    },
    {
        type: 'input',
        name: 'questions',
        message: 'Please provide an email address for others to reach you with questions.',
        when: ({ contents }) => {
            if (contents.indexOf('Questions') > -1) {
                return true;
            }
            else {
                return false;
            }
        },
        validate: input => {
            return validateInput(input, 'Please provide an email address for others to reach you with questions.');
        }
    }
];


//funtion to add screenshots recursively
function addScreenshots(readmeData) {
    if (!readmeData.screenshots) {
        readmeData.screenshots = [];
    }
    console.log(` Add New Screenshot `);
    return inquirer.prompt(screenShotQues)
        .then(screenshotData => {
            readmeData.screenshots.push(screenshotData);

            if (screenshotData.confirmAddScreenshot) {
                return addScreenshots(readmeData);
            }
            else {
                return readmeData;
            }
        })
}

const screenShotQues = [
    {
        type: 'input',
        name: 'screenshotLink',
        message: 'Please provide a link for your screenshot. (Required)',
        validate: input => {
            return validateInput(input, 'Please provide a link for your screenshot.');
        }
    },
    {
        type: 'input',
        name: 'screenshotAlt',
        maessage: 'Please provide alt text for your screenshot. (Required)',
        validate: input => {
            return validateInput(input, 'Please provide alt text for your screenshot.');
        }
    },
    {
        type: 'input',
        name: 'screenshotDesc',
        message: 'Please provide a description of your screenshot. (Optional)'
    },
    {
        type: 'confirm',
        name: 'confirmAddScreenshot',
        message: 'Would you like to add another screenshot?',
        default: false
    }
]

function validateInput(input, message) {
    if (input) {
        return true;
    }
    else {
        console.log(message);
        return false;
    }

}

// TODO: Create a function to write README file
function writeToFile(fileName, data) {
    fs.writeFile(`./targetFolder/${fileName}`, data, err => {
        if (err) {
            throw err;
        }
        console.log('README created!');
    })
}

// TODO: Create a function to initialize app
function init() {
    return inquirer.prompt(questions);
}

// Function call to initialize app
init()
    .then(response => {
        if (response.contents.indexOf('Screenshots') > -1) {
            return addScreenshots(response);
        }
        else {
            return response;
        }
    })
    .then(answers => generateMarkdown(answers))
    .then(generateReadme => writeToFile('README.md', generateReadme))
    .catch(err => {
        console.log(err);
    });
