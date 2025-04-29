import React,{useState,useEffect} from 'react';
import axios from 'axios';
import './AdminVenue.css';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import {FaSearch,FaFileExport,FaEdit,FaTrash,FaCheck,FaTimes} from 'react-icons/fa';

const AdminVenue=()=>{
const [activeTab,setActiveTab]=useState('bookings');
const [bookings,setBookings]=useState([]);
const [suggestions,setSuggestions]=useState([]);
const [loading,setLoading]=useState(true);
const [error,setError]=useState(null);
const [showDeleteModal,setShowDeleteModal]=useState(false);
const [showEditModal,setShowEditModal]=useState(false);
const [currentItem,setCurrentItem]=useState(null);
const [actionType,setActionType]=useState('');
const [formData,setFormData]=useState({
name:'',email:'',phone:'',eventType:'',date:'',time:'',requirements:'',status:'pending',
venueName:'',venueId:'',capacity:'',location:''});
const [searchTerm,setSearchTerm]=useState('');
const [searchField,setSearchField]=useState('name');
const venues=[
{_id:"1",name:"Dutchman Street",location:"1/9 Court Road, Dutch Fort, Matara"},
{_id:"2",name:"Virticle by Jetwing",location:"Access Tower II, Union Place, Colombo 02"},
{_id:"3",name:"The Barnhouse Studio",location:"96/2 Galpoththa Road 11 Lane, Kalutara"},
{_id:"4",name:"Honey Beach Club",location:"No 48, Janadhipathi Mawatha, Colombo 1"},
{_id:"5",name:"Araliya Beach Resort",location:"Yaddehimulla Rd, Unawatuna"},
{_id:"6",name:"The Blue Water Hotel",location:"Thalpitiya, Wadduwa"}];

const fetchData=async()=>{
try{
setLoading(true);
const apiUrl=process.env.REACT_APP_API_URL||'http://localhost:5000';
try{await axios.get(`${apiUrl}/health`);}
catch(err){
setError('Backend server is not running. Please start the server and try again.');
setLoading(false);
return;}
const [bookingsRes,suggestionsRes]=await Promise.all([
axios.get(`${apiUrl}/api/bookings`),
axios.get(`${apiUrl}/api/venue-suggestions`)]);
const bookingsData=bookingsRes.data.data||bookingsRes.data;
const processedBookings=Array.isArray(bookingsData)?bookingsData.map(booking=>{
const venue=venues.find(v=>v._id===booking.venueId);
return{...booking,venueName:venue?venue.name:'Unknown Venue',venueLocation:venue?venue.location:''};
}):[];
setBookings(processedBookings);
const suggestionsData=suggestionsRes.data.data||suggestionsRes.data;
setSuggestions(Array.isArray(suggestionsData)?suggestionsData:[]);
setLoading(false);}
catch(err){
console.error('Error fetching data:',err);
if(err.code==='ERR_NETWORK'){
setError('Unable to connect to the server. Please check if the backend server is running.');}
else if(err.response){
setError(`Server error:${err.response.data.message||'Something went wrong'}`);}
else{
setError('Failed to load data. Please try again later.');}
setLoading(false);}};

useEffect(()=>{fetchData();},[]);

const handleTabChange=(tab)=>{setActiveTab(tab);};

const handleStatusChange=async(id,newStatus,type)=>{
try{
if(!id){
setError(`Invalid ${type} ID. Please try again.`);
return;}
const baseUrl=process.env.REACT_APP_API_URL||'http://localhost:5000';
const endpoint=type==='booking'?'bookings':'venue-suggestions';
const action=newStatus==='approved'?'approved':'reject';
const url=`${baseUrl}/api/${endpoint}/${action}/${id}`;
console.log('Making request to:',url);
await axios.put(url,{status:newStatus});
fetchData();}
catch(err){
console.error(`Error updating ${type} status:`,err);
setError(`Failed to update ${type} status. Please try again.`);}};

const handleEdit=(item,type)=>{
console.log('Original item:',item);
setCurrentItem(item);
setActionType(type);
setShowEditModal(true);
let formattedDate='';
let formattedTime='';
if(item.date){
try{
const dateObj=new Date(item.date);
formattedDate=dateObj.toISOString().split('T')[0];}
catch(err){
console.error('Error formatting date:',err);
formattedDate=item.date;}}
if(item.time){
try{
const timeStr=item.time.toString().toLowerCase().trim();
if(timeStr.includes('am')||timeStr.includes('pm')){
const [time,period]=timeStr.split(' ');
const [hours,minutes]=time.split(':');
let hour=parseInt(hours);
if(period==='pm'&&hour!==12){hour+=12;}
else if(period==='am'&&hour===12){hour=0;}
formattedTime=`${hour.toString().padStart(2,'0')}:${minutes}`;}
else{
const [hours,minutes]=timeStr.split(':');
formattedTime=`${hours.padStart(2,'0')}:${minutes.padStart(2,'0')}`;}}
catch(err){
console.error('Error formatting time:',err);
formattedTime=item.time;}}
setFormData({
name:type==='booking'?item.customerName:item.clientName||'',
email:type==='booking'?item.customerEmail:item.email||'',
phone:item.phoneNumber||'',
eventType:item.eventType||'',
date:formattedDate,
time:formattedTime,
requirements:item.specificRequirements||'',
status:item.status||'pending',
venueName:item.venueName||'',
venueId:item.venueId||'',
capacity:type==='suggestion'?(item.capacity||''):'',
location:type==='suggestion'?(item.location||''):(item.venueLocation||'')});};

const generateBookingReport=()=>{
try{
const doc=new jsPDF();
doc.setFontSize(20);
doc.setTextColor(44,62,80);
doc.text('EventEase',14,20);
doc.setFontSize(10);
doc.setTextColor(52,73,94);
doc.text('No.12, New Kandy Rd, Malabe',14,30);
doc.text('+94 11 2233445',14,35);
doc.setDrawColor(52,73,94);
doc.setLineWidth(0.5);
doc.line(14,40,196,40);
doc.setFontSize(16);
doc.setTextColor(41,128,185);
doc.text('Venue Booking Requests Report',14,55);
doc.setFontSize(10);
doc.setTextColor(52,73,94);
doc.text(`Generated on:${new Date().toLocaleDateString()}`,14,62);
const totalBookings=bookings.length;
const approvedBookings=bookings.filter(b=>b.status?.toLowerCase()==='approved').length;
const rejectedBookings=bookings.filter(b=>b.status?.toLowerCase()==='rejected').length;
const pendingBookings=bookings.filter(b=>b.status?.toLowerCase()==='pending').length;
doc.setFontSize(12);
doc.setTextColor(52,73,94);
doc.text('Booking Statistics:',14,75);
autoTable(doc,{
startY:80,
head:[['Total Bookings','Approved','Rejected','Pending']],
body:[[totalBookings,approvedBookings,rejectedBookings,pendingBookings]],
theme:'grid',
headStyles:{
fillColor:[41,128,185],
textColor:[255,255,255],
fontSize:10},
bodyStyles:{fontSize:10},
margin:{left:14}});
doc.setFontSize(14);
doc.setTextColor(46,204,113);
doc.text('Approved Bookings',14,doc.lastAutoTable.finalY+20);
const approvedData=bookings
.filter(b=>b.status?.toLowerCase()==='approved')
.map(b=>[
b.customerName||'N/A',
b.venueName||'N/A',
b.eventType||'N/A',
b.date?new Date(b.date).toLocaleDateString():'N/A',
b.time||'N/A']);
autoTable(doc,{
startY:doc.lastAutoTable.finalY+25,
head:[['Customer Name','Venue','Event Type','Date','Time']],
body:approvedData,
theme:'grid',
headStyles:{
fillColor:[46,204,113],
textColor:[255,255,255],
fontSize:10},
bodyStyles:{fontSize:9},
alternateRowStyles:{fillColor:[240,244,245]},
margin:{left:14}});
doc.save(`booking_report_${new Date().toISOString().split('T')[0]}.pdf`);}
catch(error){
console.error('Error generating booking report:',error);
setError('Failed to generate booking report');}};

const generateSuggestionsReport=()=>{
try{
const doc=new jsPDF();
doc.setFontSize(20);
doc.setTextColor(44,62,80);
doc.text('EventEase',14,20);
doc.setFontSize(10);
doc.setTextColor(52,73,94);
doc.text('No.12, New Kandy Rd, Malabe',14,30);
doc.text('+94 11 2233445',14,35);
doc.setDrawColor(52,73,94);
doc.setLineWidth(0.5);
doc.line(14,40,196,40);
doc.setFontSize(16);
doc.setTextColor(41,128,185);
doc.text('Venue Suggestions Report',14,55);
doc.setFontSize(10);
doc.setTextColor(52,73,94);
doc.text(`Generated on:${new Date().toLocaleDateString()}`,14,62);
const totalSuggestions=suggestions.length;
const approvedSuggestions=suggestions.filter(s=>s.status?.toLowerCase()==='approved').length;
const rejectedSuggestions=suggestions.filter(s=>s.status?.toLowerCase()==='rejected').length;
const pendingSuggestions=suggestions.filter(s=>s.status?.toLowerCase()==='pending').length;
doc.setFontSize(12);
doc.setTextColor(52,73,94);
doc.text('Suggestion Statistics:',14,75);
autoTable(doc,{
startY:80,
head:[['Total Suggestions','Approved','Rejected','Pending']],
body:[[totalSuggestions,approvedSuggestions,rejectedSuggestions,pendingSuggestions]],
theme:'grid',
headStyles:{
fillColor:[41,128,185],
textColor:[255,255,255],
fontSize:10},
bodyStyles:{fontSize:10},
margin:{left:14}});
doc.setFontSize(14);
doc.setTextColor(46,204,113);
doc.text('Approved Suggestions',14,doc.lastAutoTable.finalY+20);
const approvedData=suggestions
.filter(s=>s.status?.toLowerCase()==='approved')
.map(s=>[
s.clientName||'N/A',
s.venueName||'N/A',
s.location||'N/A',
s.capacity?.toString()||'N/A',
s.eventType||'N/A',
s.date?new Date(s.date).toLocaleDateString():'N/A',
s.time||'N/A']);
autoTable(doc,{
startY:doc.lastAutoTable.finalY+25,
head:[['Client Name','Venue Name','Location','Capacity','Event Type','Date','Time']],
body:approvedData,
theme:'grid',
headStyles:{
fillColor:[46,204,113],
textColor:[255,255,255],
fontSize:10},
bodyStyles:{fontSize:9},
alternateRowStyles:{fillColor:[240,244,245]},
margin:{left:14}});
doc.save(`venue_suggestions_report_${new Date().toISOString().split('T')[0]}.pdf`);}
catch(error){
console.error('Error generating suggestions report:',error);
setError('Failed to generate suggestions report');}};

const handleDeleteClick=(item,type)=>{
setCurrentItem(item);
setActionType(type);
setShowDeleteModal(true);};

const confirmDelete=async()=>{
try{
const endpoint=actionType==='booking'?'bookings':'venue-suggestions';
await axios.delete(
`${process.env.REACT_APP_API_URL||'http://localhost:5000'}/api/${endpoint}/${currentItem._id}`);
fetchData();
setShowDeleteModal(false);}
catch(err){
setError(`Failed to delete ${actionType}. Please try again.`);
console.error(`Error deleting ${actionType}:`,err);}};

const handleInputChange=(e)=>{
const {name,value}=e.target;
setFormData(prev=>({...prev,[name]:value}));};

const handleVenueChange=(e)=>{
const selectedVenueId=e.target.value;
const selectedVenue=venues.find(v=>v._id===selectedVenueId);
setFormData(prev=>({
...prev,
venueId:selectedVenueId,
venueName:selectedVenue?selectedVenue.name:'',
location:selectedVenue?selectedVenue.location:''}));};

const handleSubmit=async(e)=>{
e.preventDefault();
try{
const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
if(!emailRegex.test(formData.email)){
setError('Please enter a valid email address');
return;}
const phoneRegex=/^\d{10}$/;
if(!phoneRegex.test(formData.phone)){
setError('Phone number must be exactly 10 digits');
return;}
const selectedDate=new Date(formData.date);
const today=new Date();
today.setHours(0,0,0,0);
if(selectedDate<today){
setError('Cannot select a past date');
return;}
const endpoint=actionType==='booking'?'bookings':'venue-suggestions';
let formattedTime=formData.time;
if(formData.time){
try{
const [hours,minutes]=formData.time.split(':');
formattedTime=`${hours.padStart(2,'0')}:${minutes.padStart(2,'0')}`;}
catch(err){
console.error('Error formatting time:',err);}}
let payload;
if(actionType==='booking'){
payload={
customerName:formData.name,
customerEmail:formData.email,
phoneNumber:formData.phone,
eventType:formData.eventType,
specificRequirements:formData.requirements,
status:formData.status,
venueName:formData.venueName,
venueId:formData.venueId,
date:formData.date,
time:formattedTime};}
else{
payload={
clientName:formData.name,
email:formData.email,
phoneNumber:formData.phone,
venueName:formData.venueName,
location:formData.location,
capacity:formData.capacity?parseInt(formData.capacity):0,
eventType:formData.eventType,
specificRequirements:formData.requirements,
status:formData.status.toLowerCase(),
date:formData.date,
time:formattedTime};}
Object.keys(payload).forEach(key=>{
if(payload[key]===''||payload[key]===null||payload[key]===undefined){
delete payload[key];}});
if(actionType==='suggestion'){
const requiredFields=['clientName','email','venueName','location','capacity','eventType','date','time'];
const missingFields=requiredFields.filter(field=>!payload[field]);
if(missingFields.length>0){
throw new Error(`Missing required fields:${missingFields.join(',')}`);}}
console.log('Submitting payload:',payload);
const response=await axios.put(
`${process.env.REACT_APP_API_URL||'http://localhost:5000'}/api/${endpoint}/${currentItem._id}`,
payload);
if(response.data){
console.log('Update successful:',response.data);
fetchData();
setShowEditModal(false);}}
catch(err){
console.error(`Error updating ${actionType}:`,err);
setError(err.message||`Failed to update ${actionType}. Please try again.`);}};

const handleSearch=(e)=>{setSearchTerm(e.target.value);};
const handleSearchFieldChange=(e)=>{setSearchField(e.target.value);};

const filterData=(data)=>{
if(!searchTerm)return data;
return data.filter(item=>{
const searchValue=searchTerm.toLowerCase();
const itemValue=(()=>{
switch(searchField){
case'name':return(item.customerName||item.clientName||'').toLowerCase();
case'venue':return(item.venueName||'').toLowerCase();
case'eventType':return(item.eventType||'').toLowerCase();
case'status':return(item.status||'').toLowerCase();
case'date':return new Date(item.date).toLocaleDateString().toLowerCase();
default:return'';}})();
return itemValue.includes(searchValue);});};

const renderSearchBar=()=>{
return(
<div className="search-container">
<div className="search-wrapper">
<div className="search-input">
<FaSearch className="search-icon"/>
<input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch}/>
</div>
<div className="search-select">
<select className="search-field-select" value={searchField} onChange={handleSearchFieldChange}>
<option value="name">Name</option>
<option value="venue">Venue</option>
<option value="eventType">Event Type</option>
<option value="status">Status</option>
<option value="date">Date</option>
</select>
</div>
</div>
</div>);};

if(loading){
return(
<div className="admin-dashboard">
<div className="loading-spinner">Loading data...</div>
</div>);}

if(error){
return(
<div className="admin-dashboard">
<div className="error-message">{error}</div>
</div>);}

const renderStatusBadge=(status)=>{
const className=`status-badge ${
status==='approved'?'approved':
status==='rejected'?'rejected':'pending'}`;
return<span className={className}>{status}</span>;};

const renderActionButtons=(item,type)=>{
if(!item._id)return null;
return(
<div className="action-buttons" key={`actions-${item._id}`}>
<button className="edit-button" onClick={()=>handleEdit(item,type)}>Edit</button>
{item.status!=='approved'&&(
<button className="approve-button" onClick={()=>handleStatusChange(item._id,'approved',type)}>Approve</button>)}
{item.status!=='rejected'&&(
<button className="reject-button" onClick={()=>handleStatusChange(item._id,'rejected',type)}>Reject</button>)}
<button className="delete-button" onClick={()=>handleDeleteClick(item,type)}>Delete</button>
</div>);};

const renderFormGroup=(id,type,label,value)=>{
return(
<div className="form-group">
<label htmlFor={id}>{label}</label>
<input type={type} id={id} name={id} value={value} onChange={handleInputChange}/>
</div>);};

const renderEmptyState=(message)=>{return<div className="empty-state">{message}</div>;};

const renderDeleteModal=()=>{
return(
<div className="modal-overlay">
<div className="confirmation-dialog">
<h3>Confirm Deletion</h3>
<p>Are you sure you want to delete this {actionType}? This action cannot be undone.</p>
<div className="dialog-actions">
<button className="cancel-button" onClick={()=>setShowDeleteModal(false)}>Cancel</button>
<button className="confirm-button" onClick={confirmDelete}>Delete</button>
</div>
</div>
</div>);};

const renderEditModal=()=>{
return(
<div className="modal-overlay">
<form className="edit-form" onSubmit={handleSubmit}>
<h3>Edit {actionType==='booking'?'Booking':'Venue Suggestion'}</h3>
<div className="form-section">
<h4>Contact Information</h4>
{renderFormGroup('name','text','Name',formData.name)}
{renderFormGroup('email','email','Email',formData.email)}
{renderFormGroup('phone','tel','Phone Number',formData.phone)}
</div>
<div className="form-section">
<h4>Venue Details</h4>
{actionType==='booking'?(
<div className="form-group">
<label htmlFor="venueId">Venue</label>
<select id="venueId" name="venueId" value={formData.venueId} onChange={handleVenueChange} className="form-control">
<option value="">Select Venue</option>
{venues.map(venue=>(
<option key={venue._id} value={venue._id}>{venue.name}</option>))}
</select>
</div>):(<>
{renderFormGroup('venueName','text','Venue Name',formData.venueName)}
{renderFormGroup('location','text','Location',formData.location)}
{renderFormGroup('capacity','number','Capacity',formData.capacity)}
</>)}
</div>
<div className="form-section">
<h4>Event Details</h4>
<div className="form-group">
<label htmlFor="eventType">Event Type</label>
<select id="eventType" name="eventType" value={formData.eventType} onChange={handleInputChange} className="form-control">
<option value="">Select Event Type</option>
{['Wedding','Birthday Party','Conference','Concert','Exhibition','Other'].map(type=>(
<option key={type} value={type}>{type}</option>))}
</select>
</div>
<div className="form-row">
<div className="form-group">
<label htmlFor="date">Event Date</label>
<input type="date" id="date" name="date" value={formData.date||''} onChange={handleInputChange} className="form-control"/>
</div>
<div className="form-group">
<label htmlFor="time">Event Time</label>
<input type="time" id="time" name="time" value={formData.time||''} onChange={handleInputChange} className="form-control" step="60"/>
</div>
</div>
<div className="form-group">
<label htmlFor="requirements">Specific Requirements</label>
<textarea id="requirements" name="requirements" value={formData.requirements||''} onChange={handleInputChange} rows={4} className="form-control"/>
</div>
</div>
<div className="form-section">
<h4>Status</h4>
<div className="form-group">
<label htmlFor="status">Status</label>
<select id="status" name="status" value={formData.status} onChange={handleInputChange} className="form-control">
<option value="pending">Pending</option>
<option value="approved">Approved</option>
<option value="rejected">Rejected</option>
</select>
</div>
</div>
<div className="form-actions">
<button type="button" className="cancel-button" onClick={()=>setShowEditModal(false)}>Cancel</button>
<button type="submit" className="save-button">Save Changes</button>
</div>
</form>
</div>);};

const renderBookingsTable=()=>{
const filteredBookings=filterData(bookings);
return(
<div className="bookings-section">
<div className="section-header">
<h2>All Booking Requests</h2>
<div className="total-count">{filteredBookings.length} bookings</div>
</div>
{renderSearchBar()}
{filteredBookings.length===0?(
renderEmptyState('No booking requests found.')):(
<div className="table-container">
<table className="data-table">
<thead>
<tr>
<th>Customer Details</th>
<th>Venue Information</th>
<th>Event Details</th>
<th>Status</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
{filteredBookings.map(booking=>(
<tr key={booking._id||`booking-${booking.customerName}-${booking.date}`}>
<td>
<div className="details-cell">
<div className="detail-row">
<span className="detail-label">Name:</span>
<span className="detail-value">{booking.customerName}</span>
</div>
<div className="detail-row">
<span className="detail-label">Email:</span>
<span className="detail-value">{booking.customerEmail}</span>
</div>
<div className="detail-row">
<span className="detail-label">Phone:</span>
<span className="detail-value">{booking.phoneNumber}</span>
</div>
</div>
</td>
<td>
<div className="details-cell">
<div className="detail-row">
<span className="detail-label">Venue:</span>
<span className="detail-value">{booking.venueName}</span>
</div>
<div className="detail-row">
<span className="detail-label">Location:</span>
<span className="detail-value">{booking.venueLocation}</span>
</div>
</div>
</td>
<td>
<div className="details-cell">
<div className="detail-row">
<span className="detail-label">Event Type:</span>
<span className="detail-value">{booking.eventType}</span>
</div>
<div className="detail-row">
<span className="detail-label">Date:</span>
<span className="detail-value">{new Date(booking.date).toLocaleDateString()}</span>
</div>
<div className="detail-row">
<span className="detail-label">Time:</span>
<span className="detail-value">{booking.time}</span>
</div>
{booking.specificRequirements&&(
<div className="detail-row">
<span className="detail-label">Requirements:</span>
<span className="detail-value">{booking.specificRequirements}</span>
</div>)}
</div>
</td>
<td>
<div className="status-cell">
{renderStatusBadge(booking.status)}
</div>
</td>
<td>{renderActionButtons(booking,'booking')}</td>
</tr>))}
</tbody>
</table>
</div>)}
</div>);};

const renderSuggestionsTable=()=>{
const filteredSuggestions=filterData(suggestions);
return(
<div className="suggestions-section">
<div className="section-header">
<h2>All Venue Suggestions</h2>
<div className="total-count">{filteredSuggestions.length} suggestions</div>
</div>
{renderSearchBar()}
{filteredSuggestions.length===0?(
renderEmptyState('No venue suggestions found.')):(
<div className="table-container">
<table className="data-table">
<thead>
<tr>
<th>Client Details</th>
<th>Venue Information</th>
<th>Event Details</th>
<th>Status</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
{filteredSuggestions.map(suggestion=>(
<tr key={suggestion._id||`suggestion-${suggestion.clientName}-${suggestion.date}`}>
<td>
<div className="details-cell">
<div className="detail-row">
<span className="detail-label">Name:</span>
<span className="detail-value">{suggestion.clientName}</span>
</div>
<div className="detail-row">
<span className="detail-label">Email:</span>
<span className="detail-value">{suggestion.email}</span>
</div>
<div className="detail-row">
<span className="detail-label">Phone:</span>
<span className="detail-value">{suggestion.phoneNumber}</span>
</div>
</div>
</td>
<td>
<div className="details-cell">
<div className="detail-row">
<span className="detail-label">Venue:</span>
<span className="detail-value">{suggestion.venueName}</span>
</div>
<div className="detail-row">
<span className="detail-label">Location:</span>
<span className="detail-value">{suggestion.location}</span>
</div>
<div className="detail-row">
<span className="detail-label">Capacity:</span>
<span className="detail-value">{suggestion.capacity} people</span>
</div>
</div>
</td>
<td>
<div className="details-cell">
<div className="detail-row">
<span className="detail-label">Event Type:</span>
<span className="detail-value">{suggestion.eventType}</span>
</div>
<div className="detail-row">
<span className="detail-label">Date:</span>
<span className="detail-value">{new Date(suggestion.date).toLocaleDateString()}</span>
</div>
<div className="detail-row">
<span className="detail-label">Time:</span>
<span className="detail-value">{suggestion.time}</span>
</div>
{suggestion.specificRequirements&&(
<div className="detail-row">
<span className="detail-label">Requirements:</span>
<span className="detail-value">{suggestion.specificRequirements}</span>
</div>)}
</div>
</td>
<td>
<div className="status-cell">
{renderStatusBadge(suggestion.status.toLowerCase())}
</div>
</td>
<td>{renderActionButtons(suggestion,'suggestion')}</td>
</tr>))}
</tbody>
</table>
</div>)}
</div>);};

return(
<div className="admin-venue-container">
<h2>Venue Management</h2>
<div className="tab-buttons">
<button className={activeTab==='bookings'?'active':''} onClick={()=>handleTabChange('bookings')}>
Booking Requests
</button>
<button className={activeTab==='suggestions'?'active':''} onClick={()=>handleTabChange('suggestions')}>
Venue Suggestions
</button>
</div>
<div className="actions-bar">
<div className="search-section">
<FaSearch className="search-icon"/>
<input type="text" placeholder={`Search ${activeTab}...`} value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>
<select value={searchField} onChange={(e)=>setSearchField(e.target.value)}>
<option value="name">Name</option>
<option value="venue">Venue</option>
<option value="status">Status</option>
</select>
</div>
<button className="generate-report-btn" onClick={()=>activeTab==='bookings'?generateBookingReport():generateSuggestionsReport()}>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
<polyline points="7 10 12 15 17 10"></polyline>
<line x1="12" y1="15" x2="12" y2="3"></line>
</svg>
Export Report
</button>
</div>
{activeTab==='bookings'?renderBookingsTable():renderSuggestionsTable()}
{showDeleteModal&&renderDeleteModal()}
{showEditModal&&renderEditModal()}
</div>);};

export default AdminVenue;