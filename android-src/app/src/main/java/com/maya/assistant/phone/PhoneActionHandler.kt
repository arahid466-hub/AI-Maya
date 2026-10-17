package com.maya.assistant.phone

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.database.Cursor
import android.hardware.camera2.CameraManager
import android.media.AudioManager
import android.net.Uri
import android.os.Build
import android.provider.AlarmClock
import android.provider.ContactsContract
import android.provider.MediaStore
import android.widget.Toast
import androidx.core.content.ContextCompat

class PhoneActionHandler(private val context: Context) {

    // Strict list of blocked financial packages & keywords
    private val blockedFinancialPackages = setOf(
        "com.google.android.apps.nbu.paisa.user", // Google Pay
        "com.phonepe.app",                        // PhonePe
        "net.one97.paytm",                        // Paytm
        "in.org.npci.upiapp",                     // BHIM UPI
        "com.axis.mobile",                        // Axis Bank
        "com.msf.kbank.mobile",                   // Kotak Bank
        "com.sbi.lotusintouch"                    // YONO SBI
    )

    fun isActionAllowed(targetPackageOrQuery: String): Boolean {
        val lower = targetPackageOrQuery.lowercase()
        val bankKeywords = listOf("gpay", "phonepe", "paytm", "bhim", "upi", "bank", "transfer money", "send money")
        if (bankKeywords.some { lower.contains(it) }) return false
        return !blockedFinancialPackages.contains(targetPackageOrQuery)
    }

    private fun List<String>.some(predicate: (String) -> Boolean): Boolean {
        for (item in this) {
            if (predicate(item)) return true
        }
        return false
    }

    // Flashlight / Torch
    fun toggleFlashlight(turnOn: Boolean): Boolean {
        return try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                val cameraManager = context.getSystemService(Context.CAMERA_SERVICE) as CameraManager
                val cameraId = cameraManager.cameraIdList.firstOrNull() ?: return false
                cameraManager.setTorchMode(cameraId, turnOn)
                true
            } else false
        } catch (e: Exception) {
            false
        }
    }

    // Volume Control
    fun adjustVolume(direction: String): Boolean {
        return try {
            val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
            when (direction.lowercase()) {
                "up" -> audioManager.adjustStreamVolume(AudioManager.STREAM_MUSIC, AudioManager.ADJUST_RAISE, AudioManager.FLAG_SHOW_UI)
                "down" -> audioManager.adjustStreamVolume(AudioManager.STREAM_MUSIC, AudioManager.ADJUST_LOWER, AudioManager.FLAG_SHOW_UI)
                "mute" -> audioManager.adjustStreamVolume(AudioManager.STREAM_MUSIC, AudioManager.ADJUST_MUTE, AudioManager.FLAG_SHOW_UI)
            }
            true
        } catch (e: Exception) {
            false
        }
    }

    // Camera App Launch
    fun openCamera(): Boolean {
        return try {
            val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(intent)
            true
        } catch (e: Exception) {
            false
        }
    }

    // Set Alarm with user review
    fun setAlarm(hour: Int = 7, minute: Int = 0, message: String = "Maya Alarm"): Boolean {
        return try {
            val intent = Intent(AlarmClock.ACTION_SET_ALARM).apply {
                putExtra(AlarmClock.EXTRA_HOUR, hour)
                putExtra(AlarmClock.EXTRA_MINUTES, minute)
                putExtra(AlarmClock.EXTRA_MESSAGE, message)
                putExtra(AlarmClock.EXTRA_SKIP_UI, false)
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(intent)
            true
        } catch (e: Exception) {
            false
        }
    }

    // Launch Dialer with pre-filled number
    fun openDialer(phoneNumber: String): Boolean {
        return try {
            val intent = Intent(Intent.ACTION_DIAL).apply {
                data = Uri.parse("tel:${Uri.encode(phoneNumber)}")
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(intent)
            true
        } catch (e: Exception) {
            false
        }
    }

    // Prepare SMS with pre-filled recipient and message
    fun prepareSms(recipient: String, message: String): Boolean {
        return try {
            val uri = Uri.parse("smsto:${Uri.encode(recipient)}")
            val intent = Intent(Intent.ACTION_SENDTO, uri).apply {
                putExtra("sms_body", message)
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(intent)
            true
        } catch (e: Exception) {
            false
        }
    }

    // Contacts search with permission check
    fun searchContacts(query: String): List<ContactResult> {
        val results = mutableListOf<ContactResult>()
        if (ContextCompat.checkSelfPermission(context, Manifest.permission.READ_CONTACTS) != PackageManager.PERMISSION_GRANTED) {
            return results
        }
        try {
            val projection = arrayOf(
                ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME,
                ContactsContract.CommonDataKinds.Phone.NUMBER
            )
            val selection = "${ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME} LIKE ?"
            val selectionArgs = arrayOf("%$query%")
            val cursor: Cursor? = context.contentResolver.query(
                ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
                projection,
                selection,
                selectionArgs,
                "${ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME} ASC"
            )
            cursor?.use {
                val nameIndex = it.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME)
                val numberIndex = it.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER)
                while (it.moveToNext() && results.size < 8) {
                    val name = if (nameIndex >= 0) it.getString(nameIndex) else "Contact"
                    val number = if (numberIndex >= 0) it.getString(numberIndex) else ""
                    results.add(ContactResult(name, number))
                }
            }
        } catch (e: Exception) {}
        return results
    }

    // Launch everyday application
    fun launchAppByName(appName: String): Boolean {
        val lower = appName.lowercase().trim()
        if (!isActionAllowed(lower)) {
            Toast.makeText(context, "Banking applications are strictly blocked for your security.", Toast.LENGTH_LONG).show()
            return false
        }

        val pm = context.packageManager
        val packageMap = mapOf(
            "gmail" to "com.google.android.gm",
            "chrome" to "com.android.chrome",
            "whatsapp" to "com.whatsapp",
            "instagram" to "com.instagram.android",
            "youtube" to "com.google.android.youtube",
            "spotify" to "com.spotify.music",
            "maps" to "com.google.android.apps.maps",
            "clock" to "com.google.android.deskclock"
        )

        for ((key, pkg) in packageMap) {
            if (lower.contains(key)) {
                val launchIntent = pm.getLaunchIntentForPackage(pkg)
                if (launchIntent != null) {
                    launchIntent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
                    context.startActivity(launchIntent)
                    return true
                }
            }
        }
        return false
    }

    data class ContactResult(val name: String, val number: String)
}
