<script setup>
import { ref, onMounted } from 'vue';
import { Upload, ImageIcon, Trash2, X, CheckCircle2, Loader2 } from 'lucide-vue-next';
import api from '../../api/api';

const props = defineProps({
    multiple: { type: Boolean, default: true },
    accept: { type: String, default: 'image/*' },
    maxFiles: { type: Number, default: 10 },
});

const emit = defineEmits(['images-uploaded']);

const fileInput = ref(null);
const isDragOver = ref(false);
const selectedFiles = ref([]);
const previewUrls = ref([]);
const uploading = ref(false);
const uploadedImages = ref([]);

const triggerFileInput = () => fileInput.value.click();

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
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    const remainingSlots = props.maxFiles - selectedFiles.value.length;
    const filesToAdd = imageFiles.slice(0, remainingSlots);
    if (filesToAdd.length === 0) return;
    selectedFiles.value.push(...filesToAdd);
    filesToAdd.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewUrls.value.push({ url: e.target.result, name: file.name, file });
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
    if (fileInput.value) fileInput.value.value = '';
};

const uploadImages = async () => {
    if (selectedFiles.value.length === 0) return;
    uploading.value = true;
    try {
        const formData = new FormData();
        selectedFiles.value.forEach((file) => formData.append('images', file));
        const response = await api.post('/images/upload-multiple', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
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
        await api.delete('/images/' + filename);
        uploadedImages.value = uploadedImages.value.filter((img) => img.filename !== filename);
    } catch (error) {
        console.error('Delete error:', error);
        alert('Delete failed: ' + (error.response?.data?.message || error.message));
    }
};

const fetchExistingImages = async () => {
    try {
        const response = await api.get('/images');
        if (response.data.success) uploadedImages.value = response.data.data;
    } catch (error) {
        console.error('Fetch images error:', error);
    }
};

onMounted(fetchExistingImages);
</script>

<template>
    <div class="space-y-6">
        <!-- Drop zone -->
        <div
            class="relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer p-10 text-center group/drop"
            :class="isDragOver
                ? 'border-accent bg-accent-50'
                : 'border-neutral-300 bg-neutral-50 hover:border-ink hover:bg-neutral-100'"
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
            <div class="flex flex-col items-center gap-3">
                <div class="w-14 h-14 rounded-2xl bg-paper border border-neutral-200 flex items-center justify-center group-hover/drop:scale-110 transition-transform">
                    <Upload class="w-6 h-6 text-ink" />
                </div>
                <div>
                    <p class="text-sm font-bold text-ink">Click or drag images here</p>
                    <p class="text-xs text-neutral-500 mt-1">Supports JPG, PNG, GIF up to 5MB each</p>
                </div>
            </div>
        </div>

        <!-- Preview section -->
        <div v-if="previewUrls.length > 0" class="space-y-3">
            <div class="flex items-center justify-between">
                <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-ink">Selected Images</h3>
                <span class="text-xs text-neutral-500 tabular-nums">{{ previewUrls.length }} file{{ previewUrls.length === 1 ? '' : 's' }}</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                <div v-for="(preview, index) in previewUrls" :key="index" class="relative group/preview">
                    <img :src="preview.url" :alt="'Preview ' + (index + 1)" class="w-full h-32 object-cover rounded-xl border-2 border-neutral-200" />
                    <button
                        @click="removeImage(index)"
                        class="absolute -top-2 -right-2 w-6 h-6 bg-ink hover:bg-accent text-white rounded-full flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-all"
                    >
                        <X class="w-3 h-3" />
                    </button>
                    <div class="text-xs text-neutral-500 mt-1 truncate">{{ preview.name }}</div>
                </div>
            </div>
        </div>

        <!-- Upload button -->
        <div v-if="selectedFiles.length > 0" class="flex gap-2">
            <button
                @click="uploadImages"
                :disabled="uploading"
                class="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-bold rounded-full hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_8px_24px_-6px_rgb(249_115_22_/_0.45)]"
            >
                <Loader2 v-if="uploading" class="w-4 h-4 animate-spin" />
                <Upload v-else class="w-4 h-4" />
                {{ uploading ? 'Uploading...' : 'Upload ' + selectedFiles.length + ' Image(s)' }}
            </button>
            <button
                @click="clearSelection"
                class="inline-flex items-center gap-2 px-5 py-2.5 bg-paper text-ink border border-neutral-300 text-sm font-bold rounded-full hover:border-ink transition-all"
            >
                Clear
            </button>
        </div>

        <!-- Uploaded images -->
        <div v-if="uploadedImages.length > 0" class="space-y-3">
            <div class="flex items-center justify-between">
                <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-ink flex items-center gap-2">
                    <CheckCircle2 class="w-4 h-4 text-accent" />
                    Uploaded Images
                </h3>
                <span class="text-xs text-neutral-500 tabular-nums">{{ uploadedImages.length }} file{{ uploadedImages.length === 1 ? '' : 's' }}</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                <div v-for="image in uploadedImages" :key="image.filename" class="relative group/preview">
                    <img :src="image.url" :alt="image.originalName" class="w-full h-32 object-cover rounded-xl border-2 border-neutral-200" />
                    <button
                        @click="deleteImage(image.filename)"
                        class="absolute -top-2 -right-2 w-6 h-6 bg-ink hover:bg-accent text-white rounded-full flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-all"
                    >
                        <Trash2 class="w-3 h-3" />
                    </button>
                    <div class="text-xs text-neutral-500 mt-1 truncate">{{ image.originalName }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
