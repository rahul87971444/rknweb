document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("year").textContent = new Date().getFullYear();

  // ======================
  // Typing effect in hero
  // ======================
  const typingText = "Aspiring CSE (IoT) Engineer | Python & Java Developer";
  const leadEl = document.querySelector(".lead");
  let i = 0;
  function typeWriter() {
    if (i < typingText.length) {
      leadEl.innerHTML = `<span class="typing">${typingText.substring(0, i + 1)}</span>`;
      i++;
      setTimeout(typeWriter, 80); // typing speed
    } else {
      // Add blinking cursor after finishing
      leadEl.innerHTML = `<span class="typing">${typingText}</span>`;
    }
  }
  typeWriter();

  // ====================================
  // Project code toggle with animation
  // ====================================
  const viewBtn = document.getElementById("viewProject");
  const codeBlock = document.getElementById("codeBlock");

  const projectCode = `import cv2
import numpy as np
import time
from gpiozero import OutputDevice
from picamera2 import Picamera2
import atexit

# ========== GPIO Relay Setup ==========
bulb = OutputDevice(5, active_high=False, initial_value=False)
fan = OutputDevice(6, active_high=False, initial_value=False)

bulb_state = False
fan_state = False
last_toggle = time.time()

# ========== Graceful Shutdown ==========
def cleanup():
    bulb.off()
    fan.off()
    cv2.destroyAllWindows()

atexit.register(cleanup)

# ========== Camera Setup ==========
picam2 = Picamera2()
picam2.configure(picam2.create_preview_configuration(main={"size": (640, 480)}))
picam2.start()
time.sleep(2)

# ========== Gesture Detection ==========
def detect_gesture(contour):
    area = cv2.contourArea(contour)

    if area > 12000:
        return "palm"
    elif 4000 < area <= 9000:
        return "closed"
    else:
        return "unknown"

# ========== Main Loop ==========
gesture_history = []
HISTORY_LENGTH = 5
frame_count = 0
PROCESS_EVERY = 2
last_detected_gesture = "none"

while True:
    frame = picam2.capture_array()
    frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)  # Fix color
    frame = cv2.flip(frame, 1)
    roi = frame[100:400, 100:400]

    if frame_count % PROCESS_EVERY == 0:
        if roi.size == 0:
            continue

        gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray, (15, 15), 0)

        thresh = cv2.adaptiveThreshold(
            blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY_INV, 11, 2
        )
        kernel = np.ones((3, 3), np.uint8)
        thresh = cv2.dilate(thresh, kernel, iterations=2)

        contours, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

        if contours:
            contour = max(contours, key=cv2.contourArea)
            area = cv2.contourArea(contour)
            print(f"Contours found: {len(contours)} | Largest area: {area}")

            if area > 2000:
                epsilon = 0.0005 * cv2.arcLength(contour, True)
                approx = cv2.approxPolyDP(contour, epsilon, True)
                cv2.drawContours(roi, [approx], -1, (0, 255, 0), 2)

                gesture = detect_gesture(contour)
                print(f"Detected gesture: {gesture}")

                gesture_history.append(gesture)
                if len(gesture_history) > HISTORY_LENGTH:
                    gesture_history.pop(0)

                if len(set(gesture_history)) == 1 and gesture_history[0] != last_detected_gesture:
                    now = time.time()
                    if now - last_toggle > 1:
                        if gesture == "palm":
                            bulb.toggle()
                            bulb_state = not bulb_state
                            print("Toggled Bulb")
                        elif gesture == "closed":
                            fan.toggle()
                            fan_state = not fan_state
                            print("Toggled Fan")
                        last_toggle = now
                        last_detected_gesture = gesture
            else:
                gesture_history.clear()
                last_detected_gesture = "none"

        # Display detected gesture
        if 'gesture' in locals():
            cv2.putText(frame, f"Gesture: {gesture}", (10, 60),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 255), 2)
            cv2.putText(frame, f"Area: {int(area)}", (10, 90),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)

    # Draw ROI and status
    cv2.rectangle(frame, (100, 100), (400, 400), (255, 0, 0), 2)
    status = f"Bulb: {'ON' if bulb_state else 'OFF'} | Fan: {'ON' if fan_state else 'OFF'}"
    cv2.putText(frame, status, (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    # Show output
    cv2.imshow("Gesture Control", frame)
    frame_count += 1

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break`;
  
  viewBtn.addEventListener("click", () => {
    // toggle class to animate open/close
    codeBlock.textContent = projectCode;
    codeBlock.classList.toggle("show");
    if (codeBlock.classList.contains("show")) {
      viewBtn.textContent = "Hide Project Code";
    } else {
      viewBtn.textContent = "View Project 1: Intelligent Home Automation System Using Hand Gesture Recognition.";
    }
  });

  // ================================
  // Scroll reveal animations
  // ================================
  const sections = document.querySelectorAll(".section");
  const reveal = () => {
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        sec.classList.add("show");
      }
    });
  };
  window.addEventListener("scroll", reveal);
  reveal();
});
