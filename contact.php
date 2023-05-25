<?php
// Get data from form
$name = $_POST['name'];
$email= $_POST['email'];
$subject= $_POST['subject'];
$phone= $_POST['phone'];
$message= $_POST['message'];

$to = "info@srinfotech.biz";
$subject = "Hey, you got a new Contact form";

// The following text will be sent
// Name = user entered name
// Email = user entered email
// Message = user entered message
$txt ="Name = ". $name . "\r\n 
Email = ". $email . "\r\n 
Subject = ". $subject . "\r\n 
Phone = ". $phone . "\r\n 
Message =" . $message;

$headers = "From: noreply@srinfotech.biz" . "\r\n" .
			"CC: hussain@srinfotech.biz";
if($email != NULL) {
	mail($to, $subject, $txt, $headers);
}

// Redirect to
header("Location:page-contact.html");
?>
