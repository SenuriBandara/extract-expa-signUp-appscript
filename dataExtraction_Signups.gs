function dataExtraction_Signups(query) {
  var requestOptions = {
    'method': 'post',
    'payload': query,
    'contentType': 'application/json',

  };
  console.log(query)
  var response = UrlFetchApp.fetch(`gisApiUrl_withAccessToken`, requestOptions);
  console.log(response.getContentText())
  var recievedDate = JSON.parse(response.getContentText())["data"]["people"];
  return recievedDate;
}

function signupsLiveUpdating() {
  var today = new Date();
  var startDate = "01/04/2024";

  // Update the endDate with today's date in DD/MM/YYYY format
  var options = { timeZone: 'Asia/Colombo', day: '2-digit', month: '2-digit', year: 'numeric' };
  var endDate = today.toLocaleDateString('en-GB', options);
  var formattedToday = endDate;
  console.log(formattedToday);

  var sheetSUs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SignUps");

  // Define headers
  const headers = [
    'EP Id', 'Signed Up at', 'Full Name', 'Phone Number', 'Gender','Date of Birth', 'Person Status', 'Background','Program', 
     'Home LC', 'Home MC', 'Campus', 'Is_aiesecer', 'Expa Referral Type', 
    'Opportunity Applications Count', 'Latest Graduation Date', 'Campaign', 'Application Id', 
    'First Applied At', 'First Approved At', 'First Realized At', 'First Finished At'
  ];

  // Add headers if they don't exist
  if (sheetSUs.getLastRow() === 0) {
    sheetSUs.appendRow(headers);
    
    // Set the background color for the headers to blue
    var headerRange = sheetSUs.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#6A0D91'); // Blue color
    headerRange.setFontColor('#FFFFFF'); // set font color to white for better contrast
  }

  var page_number = 1;
  var allData = [];
  do {
    var querySignups = `
    query {
      people(
        filters: {
          registered: { from: "${startDate}", to: "${formattedToday}" }
           sort: created_at
        }
        per_page: 1000
        page: ${page_number}
      ) {
        paging {
          current_page
          total_items
          total_pages
        }
        data {
          phone
          created_at
          id
          full_name
          opportunity_applications (first:1) {
            nodes {
              id
              status
              experience_end_date
              created_at
              date_realized
              date_matched
              date_approved
            }
          }
          contact_detail {
            phone
          }
          programmes {
            short_name
          }
          campaign {
            id
          }
          utm_campaign 
          gender
          dob
          status
          academic_experiences {
            backgrounds {
              name
            }
          }
          person_profile {
            selected_programmes
          }
          home_lc {
            name
          }
          home_mc {
            name
          }
          is_aiesecer
          referral_type
          lc_alignment {
            keywords
          }
          latest_graduation_date
          opportunity_applications_count
        }
      }
    }
    `;
    var query = JSON.stringify({ query: querySignups });
    var data = dataExtraction_Signups(query);
    if (data != null) {
      if (data.length != 0) {
        allData.push(data.data);
        page_number++;
      }
    } else {
      break;
    }
    Logger.log(data.length);
  } while (data.paging.current_page <= data.paging.total_pages);

  var betterAppObj = {
    completed: 1,
    finished: 2,
    realized: 3,
    approved: 4,
    applied: 5,
    withdrawn: 6,
    rejected: 7
  };
  let bettAppArr = Object.entries(betterAppObj);

  var newRows = [];
  var ids = sheetSUs.getRange(2, 1, sheetSUs.getLastRow(), 1).getValues();
  ids = ids.flat(1);

  for (let data of allData) {
    for (let i = 1; i < data.length; i++) {
      Logger.log(i);
      var backgrounds = [];
      var best_application = null;

      if (data[i].opportunity_applications.nodes?.length > 0) {
        best_application = data[i].opportunity_applications.nodes.reduce((acc, val) => {
          let priority = bettAppArr.reduce((betterStatus, currentVal) => currentVal[0] === "realized" ? currentVal[1] : betterStatus, 10);
          if (priority < acc.priority) {
            val.priority = priority;
            return val;
          };
          return acc;
        }, { priority: 10 });
      }

      if (data[i].academic_experiences.length > 0) {
        backgrounds = data[i].academic_experiences?.map(data => {
          if (data.backgrounds.length > 0) {
            return data.backgrounds?.map(bg => bg.name).join(",");
          }
        }).join(",");
      }

      // check if data is already present
      if (ids.indexOf(parseInt(data[i].id)) < 0) {
        newRows.push([
          data[i].id,
          data[i].created_at.substring(0, 10),
          data[i].full_name,
          data[i].contact_detail?.phone || data[i].phone,
          data[i].gender,
          data[i].dob,
          data[i].status,
          backgrounds,
          data[i].person_profile ? changeProductCode(data[i].person_profile.selected_programmes): "-",
          data[i].home_lc.name,
          data[i].home_mc.name,
          data[i].lc_alignment ? data[i].lc_alignment.keywords : "-",
          data[i].is_aiesecer == false ? "No" : "Yes",
          data[i].referral_type,
          data[i].opportunity_applications_count,
          data[i].latest_graduation_date ? data[i].latest_graduation_date.substring(0, 10) : "-",
          data[i].campaign === null ? data[i].utm_campaign : data[i].campaign.id,
          best_application?.id || "-",
          best_application?.created_at || "-",
          best_application?.date_approved || "-",
          best_application?.date_realized || "-",
          best_application?.experience_end_date || "-"
        ]);
      } else {
        var row = [];

        row.push([
           data[i].id,
          data[i].created_at.substring(0, 10),
          data[i].full_name,
          data[i].contact_detail?.phone || data[i].phone,
          data[i].gender,
          data[i].dob,
          data[i].status,
          backgrounds,
          data[i].person_profile ? changeProductCode(data[i].person_profile.selected_programmes): "-",
          data[i].home_lc.name,
          data[i].home_mc.name,
          data[i].lc_alignment ? data[i].lc_alignment.keywords : "-",
          data[i].is_aiesecer == false ? "No" : "Yes",
          data[i].referral_type,
          data[i].opportunity_applications_count,
          data[i].latest_graduation_date ? data[i].latest_graduation_date.substring(0, 10) : "-",
          data[i].campaign === null ? data[i].utm_campaign : data[i].campaign.id,
          best_application?.id || "-",
          best_application?.created_at || "-",
          best_application?.date_approved || "-",
          best_application?.date_realized || "-",
          best_application?.experience_end_date || "-"
        ]);
     

        //pushing data to old rows
        sheetSUs.getRange(ids.indexOf(parseInt(data[i].id)) + 2, 1, 1, row[0].length).setValues(row);
      }
    }
  }

  if (newRows.length > 0) {
    // pushing new rows below old rows
    sheetSUs.getRange(sheetSUs.getLastRow() + 1, 1, newRows.length, newRows[0].length).setValues(newRows);
  }
}


function changeProductCode(num) {
  var product = ""
  if (num == "7") 
    product = "GV"
  else if (num == "8") 
    product = "GTa"
  else if (num == "9") 
    product = "GTe";
  return product
}
