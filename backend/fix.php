<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$rekams = App\Models\RekamMedis::all();
foreach ($rekams as $r) {
    App\Models\Appointment::where('appointment_id', $r->appointment_id)
        ->update(['status' => 'SELESAI']);
}
echo 'done';