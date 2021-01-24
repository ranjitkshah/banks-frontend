import React, { useState, useEffect, useRef } from 'react';
import { throttle } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const columns = [
    { id: 'bank', label: 'BankId',align: 'center', },
    { id: 'ifsc', label: 'IFSC Code',align: 'center', },
    {
        id: 'branch',
        label: 'Branch',
        minWidth: 170,
        align: 'center',
    },
    {
        id: 'address',
        label: 'Address',
        minWidth: 170,
        align: 'center',
    },
    {
        id: 'city',
        label: 'City',
        minWidth: 170,
        align: 'center',
    },
    {
        id: 'district',
        label: 'district',
        minWidth: 170,
        align: 'center',
    },
    {
        id: 'state',
        label: 'state',
        minWidth: 170,
        align: 'center',
    },
];

const cities = [
    {
        value: 'banglore',
        label: 'banglore',
    },
    {
        value: 'mumbai',
        label: 'mumbai',
    },
    {
        value: 'Delhi',
        label: 'Delhi',
    },
];

// function createData(name, code, population, size) {
//     const density = population / size;
//     return { name, code, population, size, density };
// }

// const rows = [
//     createData('India', 'IN', 1324171354, 3287263),
//     createData('China', 'CN', 1403500365, 9596961),
//     createData('Italy', 'IT', 60483973, 301340),
//     createData('United States', 'US', 327167434, 9833520),
//     createData('Canada', 'CA', 37602103, 9984670),
//     createData('Australia', 'AU', 25475400, 7692024),
//     createData('Germany', 'DE', 83019200, 357578),
//     createData('Ireland', 'IE', 4857000, 70273),
//     createData('Mexico', 'MX', 126577691, 1972550),
//     createData('Japan', 'JP', 126317000, 377973),
//     createData('France', 'FR', 67022000, 640679),
//     createData('United Kingdom', 'GB', 67545757, 242495),
//     createData('Russia', 'RU', 146793744, 17098246),
//     createData('Nigeria', 'NG', 200962417, 923768),
//     createData('Brazil', 'BR', 210147125, 8515767),
// ];



export default function TableData() {
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [city, setCity] = useState('');
    const [search, setsearch] = useState('')
    const [rows, setrows] = useState([])

    console.log(rows)

    useEffect(() => {
        getAllData()
        throttled.current(search)
    },[search])

    const throttled = useRef(throttle((newValue) => console.log(newValue), 1000))

    const getAllData = () => {
        console.log(search)
        axios.get(`http://127.0.0.1:8000/api/branches/?q=${search}`).then((res) => {
            // console.log(res.data.results)
            setrows(res.data.results)
        })
    }



    const handleChange = (event) => {
        setCity(event.target.value);
    };

    const handleSearch = (e)=>{
        setsearch(e.target.value)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    return (
        <Paper className={classes.root}>
            <div className={classes.searchBar} >
                <TextField
                    id="standard-select-currency"
                    select
                    label="Bank"
                    value={city}
                    onChange={handleChange}
                    variant="outlined"
                    helperText="Please select your bank city"
                >
                    {cities.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField id="standard-basic" onChange={handleSearch} label="Search" />

            </div>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell align='center' >
                                S.No.
                            </TableCell>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,index) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={index+1}>
                                    <TableCell key={index+1} align='center' >
                                        {index+1}
                                    </TableCell>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
    searchBar: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: 20
    }
});

