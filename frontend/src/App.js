import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function App() {
	const [data, setData] = useState([]);

	useEffect(() => {
		fetch("http://localhost:5001/api/v1/candidates")
			.then((response) => response.json())
			.then((json) => {
				console.log(json);
				setData(json.data);
				setFilteredData(json.data);
			})
			.catch((error) => console.error(error));
	}, []);

	const [tableParams, setTableParams] = useState({
		sortBy: "none",
		filterBy: {
			name: "",
			status: "",
			positionApplied: "",
		},
	});

	const [filteredData, setFilteredData] = useState(data);

	// useEffect(,[])

	const onSearchParamChange = (paramName) => {
		return (event) => {
			setTableParams((prevState) => ({
				...prevState,
				filterBy: {
					...prevState?.filterBy,
					[paramName]: event.target.value,
				},
			}));
		};
	};

	const onSortByChange = (event) => {
		setTableParams((prevState) => ({
			...prevState,
			sortBy: event.target.value,
		}));
	};

	useEffect(() => {
		let newFilteredData = Array.from(data);

		if (tableParams.filterBy.name != "") {
			newFilteredData = newFilteredData.filter((ele) =>
				ele.Name.toLowerCase().includes(
					tableParams.filterBy.name.toLowerCase(),
				),
			);
		}

		if (tableParams.filterBy.status != "") {
			newFilteredData = newFilteredData.filter((ele) =>
				ele.StatusOfApplication.toLowerCase().includes(
					tableParams.filterBy.status.toLowerCase(),
				),
			);
		}

		if (tableParams.filterBy.positionApplied != "") {
			newFilteredData = newFilteredData.filter((ele) =>
				ele.PositionApplied.toLowerCase().includes(
					tableParams.filterBy.positionApplied.toLowerCase(),
				),
			);
		}

		if (tableParams.sortBy != "" && tableParams.sortBy != "none") {
			const sortParam = tableParams.sortBy;
			newFilteredData.sort((a, b) => {
				if (sortParam == "postionApplied") {
					if (a.PositionApplied < b.PositionApplied) {
						return -1;
					}
					if (a.PositionApplied > b.PositionApplied) {
						return 1;
					}
					return 0;
				} else if (sortParam == "yearExperience") {
					return a.YearsOfExperience - b.YearsOfExperience;
				} else if (sortParam == "dateOfApplication") {
					return new Date(a.DateOfApplication) - new Date(b.DateOfApplication);
				}
			});
		}

		setFilteredData(newFilteredData);

		// useSearchParams(tableParams);
	}, [tableParams]);

	return (
		<div className="App">
			<div className="Table">
				<label for="sortBy">SortBy:</label>

				<select
					name="sortBy"
					id="sortBy"
					onChange={onSortByChange}
					value={tableParams.sortBy}
				>
					<option value="none"></option>
					<option value="postionApplied">Position Applied</option>
					<option value="yearExperience">Years of experience</option>
					<option value="dateOfApplication">Date of application</option>
				</select>
			</div>
			<div className="Table">
				<table>
					<thead></thead>

					<tr>
						<th>
							Name{" "}
							<input
								type="search"
								onChange={onSearchParamChange("name")}
							></input>
						</th>
						<th>Email</th>
						<th>Age</th>
						<th>Years Of Experience</th>
						<th>
							Positioned Applied{" "}
							<input
								type="search"
								onChange={onSearchParamChange("positionApplied")}
							></input>
						</th>
						<th>Applied</th>
						<th>
							Status{" "}
							<input
								type="search"
								onChange={onSearchParamChange("status")}
							></input>
						</th>
					</tr>
					{filteredData.map((val, key) => {
						return (
							<tr key={key}>
								<td>{val.Name}</td>
								<td>{val.Email}</td>
								<td>{val.Age}</td>

								<td>{val.YearsOfExperience}</td>
								<td>{val.PositionApplied}</td>
								<td>{val.DateOfApplication}</td>

								<td>{val.StatusOfApplication}</td>
							</tr>
						);
					})}
				</table>
			</div>
		</div>
	);
}

export default App;
