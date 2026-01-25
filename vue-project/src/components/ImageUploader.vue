<template>
  <div class="image-uploader">
    <div 
      class="upload-area"
      :class="{ 'drag-over': isDragOver }"
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        class="hidden"
        @change="handleFileSelect"
      />
      
      <div class="upload-content">
        <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p class="upload-text">Click or drag images here</p>
        <p class="upload-hint">Supports JPG, PNG, GIF up to 5MB each</p>
      </div>
    </div>

    <!-- Preview Section -->
    <div v-if="previewUrls.length > 0" class="preview-section mt-4">
      <h3 class="text-sm font-semibold text-gray-700 mb-2">Selected Images</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <div 
          v-for="(preview, index) in previewUrls" 
          :key="index"
          class="relative group"
        >
          <img 
            :src="preview.url" 
            :alt="`Preview ${index + 1}`"
            class="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
          />
          <button
            @click="removeImage(index)"
            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div class="text-xs text-gray-500 mt-1 truncate">{{ preview.name }}</div>
        </div>
      </div>
    </div>

    <!-- Upload Button -->
    <div v-if="selectedFiles.length > 0" class="mt-4 flex gap-2">
      <button
        @click="uploadImages"
        :disabled="uploading"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {{ uploading ? 'Uploading...' : `Upload ${selectedFiles.length} Image(s)` }}
      </button>
      <button
        @click="clearSelection"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
      >
        Clear
      </button>
    </div>

    <!-- Uploaded Images -->
    <div v-if="uploadedImages.length > 0" class="uploaded-section mt-6">
      <h3 class="text-sm font-semibold text-gray-700 mb-2">Uploaded Images</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <div 
          v-for="image in uploadedImages" 
          :key="image.filename"
          class="relative group"
        >
          <img 
            :src="image.url" 
            :alt="image.originalName"
            class="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
          />
          <button
            @click="deleteImage(image.filename)"
            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <div class="text-xs text-gray-500 mt-1 truncate">{{ image.originalName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../api/api';

const props = defineProps({
  multiple: {
    type: Boolean,
    default: true
  },
  accept: {
    type: String,
    default: 'image/*'
  },
  maxFiles: {
    type: Number,
    default: 10
  }
});

const emit = defineEmits(['images-uploaded']);

const fileInput = ref(null);
const isDragOver = ref(false);
const selectedFiles = ref([]);
const previewUrls = ref([]);
const uploading = ref(false);
const uploadedImages = ref([]);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  processFiles(files);
};

const handleDrop = (event) => {
  isDragOver.value = false;
  const files = Array.from(event.dataTransfer.files);
  processFiles(files);
};

const processFiles = (files) => {
  // Filter image files
  const imageFiles = files.filter(file => file.type.startsWith('image/'));
  
  // Limit by maxFiles
  const remainingSlots = props.maxFiles - selectedFiles.value.length;
  const filesToAdd = imageFiles.slice(0, remainingSlots);
  
  if (filesToAdd.length === 0) return;
  
  // Add to selected files
  selectedFiles.value.push(...filesToAdd);
  
  // Create previews
  filesToAdd.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrls.value.push({
        url: e.target.result,
        name: file.name,
        file: file
      });
    };
    reader.readAsDataURL(file);
  });
};

const removeImage = (index) => {
  selectedFiles.value.splice(index, 1);
  previewUrls.value.splice(index, 1);
};

const clearSelection = () => {
  selectedFiles.value = [];
  previewUrls.value = [];
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const uploadImages = async () => {
  if (selectedFiles.value.length === 0) return;
  
  uploading.value = true;
  
  try {
    const formData = new FormData();
    
    selectedFiles.value.forEach(file => {
      formData.append('images', file);
    });
    
    const response = await api.post('/images/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (response.data.success) {
      uploadedImages.value.push(...response.data.data);
      emit('images-uploaded', response.data.data);
      clearSelection();
    }
  } catch (error) {
    console.error('Upload error:', error);
    alert('Upload failed: ' + (error.response?.data?.message || error.message));
  } finally {
    uploading.value = false;
  }
};

const deleteImage = async (filename) => {
  if (!confirm('Are you sure you want to delete this image?')) return;
  
  try {
    await api.delete(`/images/${filename}`);
    uploadedImages.value = uploadedImages.value.filter(img => img.filename !== filename);
  } catch (error) {
    console.error('Delete error:', error);
    alert('Delete failed: ' + (error.response?.data?.message || error.message));
  }
};

const fetchExistingImages = async () => {
  try {
    const response = await api.get('/images');
    if (response.data.success) {
      uploadedImages.value = response.data.data;
    }
  } catch (error) {
    console.error('Fetch images error:', error);
  }
};

onMounted(() => {
  fetchExistingImages();
});
</script>

<style scoped>
.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #f9fafb;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.upload-icon {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem;
  color: #9ca3af;
}

.upload-text {
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.upload-hint {
  font-size: 0.875rem;
  color: #6b7280;
}
</style>
